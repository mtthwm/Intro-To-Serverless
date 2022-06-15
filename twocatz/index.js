module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const url = (text) => {
        return `https://cataas.com/cat/says/${text}`;
    };

    const axios = require('axios');

    const response = await axios.get(url("Serverless"));

    const image = Buffer.from(response.data, 'binary').toString('base64');

    context.res = {
        status: 200,
        body: {
            image,
        }
    }
}