const cloudinary = require('cloudinary');
const fs = require('fs');



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const uploadcontroller  = (req,res) => {
    
     try {
         const file = req.files.file;

         cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: 'products_image'}, async(err, result) => {
            if(err) throw err;

            removeTmp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })

     } catch (error) {
          return res.status(500).json({msg: err.message})
     }


}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}

module.exports = uploadcontroller;