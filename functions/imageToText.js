const Vision = require("@google-cloud/vision");
const vision = new Vision.ImageAnnotatorClient();

const { uploadFile } = require("./uploadFile");

const BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async function(req, res) {
  const BODY = typeof req.body === "object" ? req.body : JSON.parse(req.body);

  // Get image and its file format; if no "image" passed, then fail
  const IMAGE_URL = BODY.image;
  if (!IMAGE_URL) {
    console.error("No image URL passed in body!");
    return;
  }
  const FORMAT = IMAGE_URL.split(".")[IMAGE_URL.split(".").length - 1];

  // Get content type of file; accept "jpg|jpeg" or "png", else fail
  const CONTENT_TYPE = getContentType(FORMAT);
  if (!CONTENT_TYPE) {
    console.error("No valid content type!");
    return;
  }

  // Create path for new hosted file copy
  const RANDOM = Math.random()
    .toString(36)
    .substring(7);
  const IMAGE_NAME = `${RANDOM}_${Date.now().toString()}.${FORMAT}`;
  const PATH = `gs://${BUCKET_NAME}/${IMAGE_NAME}`;

  // Attempt to upload file
  console.log("Attempting to upload file to", PATH);

  const UPLOAD = await new Promise(async (resolve, reject) => {
    try {
      resolve(
        await uploadFile(IMAGE_URL, IMAGE_NAME, BUCKET_NAME, CONTENT_TYPE)
      );
    } catch (error) {
      console.error("Error when running upload()!", error);
      reject(error);
    }
  });

  return await Promise.all([UPLOAD])
    .then(async () => {
      return await vision.textDetection(PATH).then(([detections]) => {
        return detections.textAnnotations[0].description;
      });
    })
    .catch(error => {
      return error;
    });
};

function getContentType(format) {
  const _FORMAT = format.toLowerCase();
  if (_FORMAT === "jpeg" || _FORMAT === "jpg") {
    return "image/jpeg";
  } else if (_FORMAT === "png") {
    return "image/png";
  }
  return null;
}
