module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const axios = require('axios');

    const catCount = 2;

    const getUrl = (text) => {
        return `https://cataas.com/cat/says/${text}`;
    };
    const getName = () => {
        const names = [
            "Shreya", 
            "Emily", 
            "Fifi", 
            "Beau", 
            "Evelyn", 
            "Julia", 
            "Daniel", 
            "Fardeen"
        ];

        return names[Math.floor(Math.random() * names.length)];
    }

    const finalObject = {};
    const names = [];

    for (let i = 0; i < catCount; i++)
    {
        const name = getName();
        const response = await axios.get(getUrl(name));
        const image = Buffer.from(response.data, 'binary').toString('base64');
        finalObject[`cat${i+1}`] = image;
        names.push(name);
    }

    finalObject[`names`] = names;

    context.res = {
        status: 200,
        body: finalObject,
    }
}