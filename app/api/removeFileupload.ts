import cloudinary from 'cloudinary'

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  
  const body = JSON.parse(req.body)

  try {
    await cloudinary.v2.uploader.destroy(body.public_id)
    res.end('Deleted file')
  } catch(err) {
    console.log(err)
    res.end('Error deleting file')
  }
  

  
}