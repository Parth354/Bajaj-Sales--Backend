import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload File On Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file where upload option failed 
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) 
        return null;
    }

}
export {uploadOnCloudinary}