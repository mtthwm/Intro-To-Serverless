module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const morseConverter = require('morse-code-converter');

    const {plaintext} = req.query;

    context.res = {};

    if (plaintext)
    {
        context.res.body = morseConverter.textToMorse(plaintext);
    }
    else
    {
        context.res.body = 'Please provide a message to encode';
        context.res.status = 400;
    }
}