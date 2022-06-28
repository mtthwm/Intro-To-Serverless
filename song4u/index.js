const multipart = require("parse-multipart");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const qs = require("qs");
const fetch = require("node-fetch");

module.exports = async function (context, req) {
  // PRODUCTION:

  const queryObject = qs.parse(req.body);
  const imageUrl = queryObject.MediaUrl0;
  const image = await downloadImage(imageUrl);

  // END PRODUCTION

  // // DEBUG:

  // const boundary = multipart.getBoundary(req.headers['content-type']);
  // const body = req.body;
  // const parts = multipart.Parse(body, boundary);

  // const image = parts[0].data;

  // //END DEBUG
  

  const age = await getAgeFromImage(image);
  const generation = getGenerationFromAge(age);
  const playlist = getPlaylistFromGeneration(generation);

  const message = `We guessed you're part of this generation: ${generation}! Happy listening! ${playlist}`;

  context.res = {
    status: 200 /* Defaults to 200 */,
    body: message,
  };
};

const downloadImage = async (url) => {
  const response = await fetch(url, { method: "GET" });
  return response.arrayBuffer();
};

const getAgeFromImage = async (image) => {
  const subscriptionKey = process.env.FACE_SUBSCRIPTION_KEY;
  const endpoint = process.env.FACE_ENDPOINT;

  const params = new URLSearchParams({
    returnFaceAttributes: "age",
  });

  const url = `${endpoint}/face/v1.0/detect?${params.toString()}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
    },
    body: image,
  });
  const responseObj = await response.json();
  return responseObj[0].faceAttributes.age;
};

const getGenerationFromAge = (age) => {
  const generations = [
    { name: "GenZ", start: 5, end: 25 },
    { name: "GenY", start: 24, end: 41 },
    { name: "GenX", start: 40, end: 57 },
    { name: "BabyBoomers", start: 56, end: 76 },
  ];

  for (let i = 0; i < generations.length; i++) {
    const generation = generations[i];
    if (generation.start < age && age < generation.end) {
      return generation.name;
    }
  }

  return "Unknown";
};

const getPlaylistFromGeneration = (generation) => {
  const songs = {
    GenZ: "https://open.spotify.com/track/0SIAFU49FFHwR3QnT5Jx0k?si=1c12067c9f2b4fbf",
    GenY: "https://open.spotify.com/track/1Je1IMUlBXcx1Fz0WE7oPT?si=a04bbdf6ec4948b9",
    GenX: "https://open.spotify.com/track/4Zau4QvgyxWiWQ5KQrwL43?si=790d9e3ef2ed408d",
    BabyBoomers:
      "https://open.spotify.com/track/4gphxUgq0JSFv2BCLhNDiE?si=1abb329f2dc24f50",
    Unknown:
      "https://open.spotify.com/track/5ygDXis42ncn6kYG14lEVG?si=84b49b41d09d4d11",
  };

  return songs[generation];
};
