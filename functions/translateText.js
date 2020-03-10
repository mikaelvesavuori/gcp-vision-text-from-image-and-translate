const { Translate } = require("@google-cloud/translate").v2;
const client = new Translate();

exports.handler = async function(req, res) {
  const BODY = typeof req.body === "object" ? req.body : JSON.parse(req.body);

  const TEXT = BODY.text;
  const TARGET_LANG = BODY.targetLang;

  return await client
    .translate(TEXT, TARGET_LANG)
    .then(results => {
      return results;
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
};
