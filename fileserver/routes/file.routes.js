const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pipeline } = require("stream/promises");
const axios = require("axios"); // Add this line to import axios

const FileRouter = Router();
const VideoRouter = Router();

const videoPath = path.join(__dirname, "../public/videos");

if (!fs.existsSync(videoPath)) {
  fs.mkdirSync(videoPath);
}


const videoUpload = multer();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const randomNumbers = Math.floor(100 + Math.random() * 900);
    cb(null, `${randomNumbers}-${originalName}`);
  },
});

const fileUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

FileRouter.post("/", fileUpload.array("files", 30), async function (req, res) {
  try {
    if (!req.files || req.files.length === 0) throw new Error("Aucun fichier envoyé");
    const uploadedFiles = req.files.map(file => file.filename);
    res.json(uploadedFiles);
  } catch (err) {
    res.status(500).send("Impossible de télécharger vos fichiers, nous y travaillons");
  }
});

// Endpoint pour uploader une vidéo
VideoRouter.post("/upload", videoUpload.single("video"), async (req, res) => {
  const chunkIndex = parseInt(req.body.chunk, 10);
  const totalChunks = parseInt(req.body.totalChunks, 10);
  const chunkData = req.file.buffer;
  const originalFilename = req.file.originalname;

  try {
    // Sauvegarder chaque chunk temporairement
    const tempFilePath = path.join(videoPath, `${originalFilename}-${chunkIndex}`);
    fs.writeFileSync(tempFilePath, chunkData);

    // Vérifier si tous les chunks ont été reçus
    const chunksReceived = fs
      .readdirSync(videoPath)
      .filter((file) => file.startsWith(originalFilename) && file.includes("-"))
      .length;

    if (chunksReceived === totalChunks) {
      // Fusionner les chunks une fois tous reçus
      const tempVideoPath = path.join(videoPath, originalFilename);

      try {
        const writeStream = fs.createWriteStream(tempVideoPath);

        for (let i = 0; i < totalChunks; i++) {
          const chunkFilePath = path.join(videoPath, `${originalFilename}-${i}`);
          const chunkStream = fs.createReadStream(chunkFilePath);

          await new Promise((resolve, reject) => {
            chunkStream.on("error", reject);
            writeStream.on("error", reject);
            chunkStream.on("end", resolve);
            chunkStream.pipe(writeStream, { end: false });
          });
        }

        // Terminer l'écriture
        writeStream.end();

        // Nettoyer les fichiers temporaires
        for (let i = 0; i < totalChunks; i++) {
          fs.unlinkSync(path.join(videoPath, `${originalFilename}-${i}`));
        }

        // Renommer la vidéo finale
        const sanitizeFilename = (filename) => {
          const timestamp = Date.now();
          const sanitized = filename
            .replace(/[^a-zA-Z0-9.-]/g, "_") // Remplacer caractères spéciaux par "_"
            .replace(/\s+/g, "_"); // Remplacer espaces par "_"
          return `${timestamp}_${sanitized}`;
        };

        const finalVideoFilename = sanitizeFilename(originalFilename);
        const finalVideoPath = path.join(videoPath, finalVideoFilename);

        fs.renameSync(tempVideoPath, finalVideoPath);

        res.status(200).json({
          message: "Vidéo téléchargée, fusionnée et renommée avec succès",
          videoUrl: `/videos/${finalVideoFilename}`,
        });
      } catch (mergeError) {
        console.error("Erreur lors de la fusion :", mergeError);
        res.status(500).json({ message: "Erreur lors de la fusion des chunks" });
      }
    } else {
      res.status(200).json({
        message: `Chunk ${chunkIndex + 1} reçu, en attente des autres morceaux`,
      });
    }
  } catch (error) {
    console.error("Erreur d'upload :", error);
    res.status(500).json({ message: "Erreur lors de l'upload" });
  }
});




// Endpoint pour lire une vidéo en streaming
VideoRouter.get("/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(videoPath, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Vidéo introuvable");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const readStream = fs.createReadStream(filePath, { start, end });

    res.status(206).header({
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });
    readStream.pipe(res);
  } else {
    res.header("Content-Length", fileSize);
    res.contentType("video/mp4");
    fs.createReadStream(filePath).pipe(res);
  }
});

VideoRouter.post("/download-from-url", async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ message: "L'URL de la vidéo est requise" });
    }

    // Récupérer le nom du fichier depuis l'URL
    const urlParts = new URL(videoUrl);
    let originalFilename = path.basename(urlParts.pathname);

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const sanitizedFilename = originalFilename
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/\s+/g, "_");
    const finalFilename = `${timestamp}_${sanitizedFilename}`;
    const savedFilePath = path.join(videoPath, finalFilename);

    // Télécharger la vidéo
    const response = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream'
    });

    // Sauvegarder le fichier
    await pipeline(
      response.data,
      fs.createWriteStream(savedFilePath)
    );

    res.status(200).json({
      message: "Vidéo téléchargée avec succès",
      filename: finalFilename,
      videoUrl: `/videos/${finalFilename}`
    });

  } catch (error) {
    console.error("Erreur lors du téléchargement de la vidéo:", error);
    res.status(500).json({
      message: "Erreur lors du téléchargement de la vidéo",
      error: error.message
    });
  }
});

module.exports = { VideoRouter, FileRouter };