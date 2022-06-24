const multipart = require('parse-multipart');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});

module.exports = async function (context, req) {
    const boundary = multipart.getBoundary(req.headers['content-type']);
    const body = req.body;
    const parts = multipart.Parse(body, boundary);
    const base64Image = parts[0].data.toString('base64');
    const emotions = await getImageEmotions(parts[0].data);
    const dominantEmotion = getDominantEmotion(emotions[0]);
    const gif = await getRandomGiphy(dominantEmotion.emotion, 'g');

    context.res = {
        status: 200,
        body: gif.data.url,
    };
}

const getDominantEmotion = (emotionData) => {
    let maxEmotion = null;
    let maxEmotionValue = null;
    for (let [emotion, value] of Object.entries(emotionData.faceAttributes.emotion))
    {
        if (maxEmotionValue === null || maxEmotionValue < value)
        {
            maxEmotion = emotion;
            maxEmotionValue = value;
        }
    }
    return {emotion: maxEmotion, value: maxEmotionValue};
};

const getImageEmotions = async (imageBuffer) => {
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const urlBase = process.env.ENDPOINT + '/face/v1.0/detect';
    const parameters = new URLSearchParams({
        'returnFaceAttributes': 'emotion',
        'returnFaceIds': 'true',
    });
    const url = `${urlBase}?${parameters.toString()}`;

    const response = await fetch(url, {
        method: 'POST',
        body: imageBuffer,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
    });

    return response.json();
};

const getRandomGiphy = async (tag, rating) => {
    const params = new URLSearchParams({
        api_key: process.env.GIPHY_ENDPOINT,
        tag: tag,
        rating: rating,  
    });
    const url = `https://api.giphy.com/v1/gifs/random?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}