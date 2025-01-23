"use client"
import React from 'react';

import { saveImage, uploadImage } from '@/lib/leonardo/fetch';

const UploadImageComponent = () => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Convertir le fichier en base64
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
      })

    const base64Image = await toBase64(file)
    const fileName = file.name

    // Appeler la Server Action pour enregistrer l'image
    const result = await saveImage(base64Image, fileName)
    uploadImage(result)
    console.log(result)
  }

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  )
}

export default UploadImageComponent
