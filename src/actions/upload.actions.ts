"use server"

export const uploadMultipleFile = async (
  formData: FormData,
): Promise<string[]> => {
  const uploadResponse = await fetch(`${process.env.FILE_SERVER}/`, {
    method: "POST",
    body: formData,
    headers: {},
  })

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`)
  }

  const responseData = await uploadResponse.json()
  return responseData.map((filename: string) => {
    return `${process.env.FILE_SERVER}/public/${filename}`
  })
}

export const uploadOneFile = async (formData: FormData): Promise<string> => {
  const uploadResponse = await fetch(`${process.env.FILE_SERVER}/`, {
    method: "POST",
    body: formData,
    headers: {},
  })

  console.log(`Upload failed: ${uploadResponse.statusText}`)
  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`)
  }

  const responseData = await uploadResponse.json()
  const urls = responseData.map((filename: string) => {
    return `${process.env.FILE_SERVER}/public/${filename}`
  })
  return urls[0]
}
