const multipart = require('parse-multipart');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env')});
const qs = require('qs');
const fetch = require('node-fetch');

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

    context.res = {
        status: 200, /* Defaults to 200 */
        body: generation,
    };
};

const downloadImage = async (url) => {
    const response = await fetch(url, {method: 'GET'});
    return response.arrayBuffer();
};

const getAgeFromImage = async (image) => {
    const subscriptionKey = process.env.FACE_SUBSCRIPTION_KEY;
    const endpoint = process.env.FACE_ENDPOINT;

    const params = new URLSearchParams({
        returnFaceAttributes: 'age',
    });

    const url = `${endpoint}/face/v1.0/detect?${params.toString()}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
        body: image,
    });
    const responseObj = await response.json();
    return responseObj[0].faceAttributes.age;
};

const getGenerationFromAge = (age) => {
    const generations = [
        {name: "GenZ", start: 5, end: 25},
        {name: "GenY", start: 24, end: 41},
        {name: "GenX", start: 40, end: 57},
        {name: "BabyBoomers", start: 56, end: 76},
    ];

    for (let i = 0; i < generations.length; i++)
    {
        const generation = generations[i];
        if (generation.start < age && age < generation.end)
        {
            return generation.name;
        }
    }

    return "Unknown";
};