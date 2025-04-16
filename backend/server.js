import app from "./app.js";
import { connection } from "./database/connection.js";
import cloudinary from 'cloudinary'
cloudinary.v2.config(
  {
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_CLOUD_KEY,
  api_secret:process.env.CLOUDINARY_CLOUD_KEY_SECRETE
  }
)
app.listen(process.env.PORT,()=>
{
  
  console.log(`server running on ${process.env.PORT}`)
})