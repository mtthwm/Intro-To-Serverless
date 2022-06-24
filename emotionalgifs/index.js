const multipart = require('parse-multipart');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    const boundary = multipart.getBoundary(req.headers['content-type']);

    const body = req.body;

    const parts = multipart.Parse(body, boundary);

    const base64Image = parts[0].data.toString('base64');

    const emotions = getImageEmotions(parts[0].data);


    context.res = {
        status: 200,
        body: emotions,
    };
}

const getImageEmotions = (imageBuffer) => {
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const urlBase = process.env.ENDPOINT + '/face/v1.0/detect';
    const parameters = new URLSearchParams({
        'returnFaceAttributes': 'emotion',
        'returnFaceIds': 'true',
    });

    const response = await fetch(`${urlBase}?${parameters.toString()}`, {
        method: 'POST',
        body: imageBuffer,
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    });

    return response.json();
};