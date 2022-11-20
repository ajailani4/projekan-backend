const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary-config');

const uploadIcon = (folderName, icon) => new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: folderName },
    (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    },
  );

  streamifier.createReadStream(icon).pipe(uploadStream);
});

const deleteIcon = async (publicId) => {
  cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadIcon, deleteIcon };
