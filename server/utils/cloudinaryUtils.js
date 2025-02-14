const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMediaToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: 'auto'
        });
        return {
            public_id: result.public_id,
            secure_url: result.secure_url
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
module.exports = { uploadMediaToCloudinary };