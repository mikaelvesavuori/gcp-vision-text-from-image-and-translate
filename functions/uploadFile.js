const fetch = require("node-fetch");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();

/**
 * Upload file (image) to Cloud Storage
 *
 * Reference: https://github.com/googleapis/nodejs-storage/issues/506#issuecomment-436403257
 *
 * @async
 * @function
 * @param {string} imageUrl - The URL for the original image
 * @param {string} imageName - The unique UUID image name
 * @param {string} bucketName - The name of the bucket
 * @param {string} contentType - The content-type of the file
 * @returns {WritableStream} - Returns stream
 */
exports.uploadFile = function(imageUrl, imageName, bucketName, contentType) {
  return fetch(imageUrl).then(async res => {
    try {
      await new Promise((resolve, reject) => {
        const BUCKET = storage.bucket(bucketName);
        const FILE = BUCKET.file(imageName);
        const WRITE_STREAM = FILE.createWriteStream({
          metadata: {
            contentType
          }
        });

        WRITE_STREAM.on("error", error => {
          console.error("Error in writeStream!", error);
          reject(error);
        });

        WRITE_STREAM.on("finish", () => {
          resolve(true);
        });

        res.body.pipe(WRITE_STREAM);
      });
    } catch (error) {
      console.error("Error when trying to fetch image and process it!", error);
      return false;
    }
  });
};
