const express = require("express");
const { FileRouter, VideoRouter } = require("./routes/file.routes");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const multer = require("multer");

const app = express();
const port = 9901;

// Middleware
app.use(compression());
app.use(express.static("public"));
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

// Utilisation des routeurs
app.use("/", FileRouter);
app.use("/videos", VideoRouter);

app.use("/public", express.static(path.join(__dirname, "/public")))

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).send(`Erreur de téléchargement : ${err.message}`);
  } else {
    console.error("Erreur :", err.stack);
    res.status(500).send("Une erreur s'est produite.");
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.warn(`Server is running on port ${port}`);
});
