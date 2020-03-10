"use strict";

const imageToText = require("./functions/imageToText");
const translateText = require("./functions/translateText");

exports.imageToText = async (req, res) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method == "OPTIONS") {
    res.status(204).send("");
  }

  if (!req.body) {
    res.status(400).send(JSON.stringify("No body provided!"));
  }

  const response = await imageToText.handler(req, res);

  res.status(200).send({
    body: JSON.stringify(response)
  });
};

exports.translateText = async (req, res) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method == "OPTIONS") {
    res.status(204).send("");
  }

  if (!req.body) {
    res.status(400).send(JSON.stringify("No body provided!"));
  }

  const response = await translateText.handler(req, res);

  res.status(200).send(JSON.stringify(response));
};
