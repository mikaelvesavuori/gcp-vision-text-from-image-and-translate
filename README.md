# OCR (translation; image-to-text) demo on Google Cloud Platform

This is a simple demo to translate text (Cloud Translation API) and reading text from an image (Cloud Vision API). It uses Node.js 10 on Cloud Functions, with Serverless Framework as the deployment framework.

You will need to download any referenced images to a storage bucket that needs to be set up manually before-hand.

## Setup

1. You need a Google Cloud Platform account
2. Create a new Cloud Storage bucket that your service account or profile can access
3. You will likely need to enable APIs for Cloud Translation API, Cloud Vision API, and possibly also Cloud Functions
4. Add your credential file path, project ID, and storage bucket name to `serverless.yml`

## Deploy project

- You might need a local installation first, so do that with `npm install`
- Run `sls deploy` to use Serverless Framework to deploy the project
- After about 2 minutes it should be live on the two URLs you receive

## Functions

### Image to text

This takes an image, downloads it to a storage bucket, then reads any text from it.

POST `https://{REGION}-{PROJECT}.cloudfunctions.net/imageToText`

**Example**:

```
{
  "image": "https://images-na.ssl-images-amazon.com/images/I/819uy05D6iL._SL1500_.jpg"
}
```

Should return:

```
{
  "body": "\"O grams\\nTrans Fat\\nOMaruchan.\\nSEE NUTRITION\\nINFORMATION FOR\\nSODIUM CONTENT\\nRamen\\nNoodle Soup\\nChicken Flavor\\nNET WI 3 02\\nSUGGESTED SERVING\\nGUOKS IMMINUTES\\n\""
}
```

### Translate text

This function translates any text to the requested target language.

POST `https://{REGION}-{PROJECT}.cloudfunctions.net/translateText`

**Example**:

```
{
  "text": "Hej alla cloud-människor!",
  "targetLang": "en"
}
```

Should return:

```
[
  "Hi all cloud people!",
  {
    "data": {
      "translations": [
        {
          "translatedText": "Hi all cloud people!",
          "detectedSourceLanguage": "sv"
        }
      ]
    }
  }
]
```
