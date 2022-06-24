const multipart = require('parse-multipart');

module.exports = async function (context, req) {
    const boundary = multipart.getBoundary(req.headers['content-type']);

    const body = req.body;

    const parts = multipart.Parse(body, boundary);

    const base64Image = parts[0].data.toString('base64');

    context.res = {
        status: 200,
        body: base64Image,
    };
}