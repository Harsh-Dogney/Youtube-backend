import { v2 as cloudinary } from 'cloudinary';
import { urlencoded } from 'express';
import fs from "filesystem"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET    // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localfilepath)=> {
    try {
        if(!localfilepath)return null;
        //upload the file on cloudniary
        const response =await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto",
            // file hgas been uloaded sucessfully
        })
        console.log("file is uploaded on cloudinary",
        response.url);
        return response; 


    } catch (error) {
        fs.unlinkSync(localfilepath) // remove the locally saved filr as the upload operation got failes 
        return null;  
    }
}

// cloudinary.v2.uploader.upload("link",
//     {
//         public_id: "olympic_flag"
//     },
//     function (error, result) {
//         console.log(result);
//     })

    export { uploadOnCloudinary
    }