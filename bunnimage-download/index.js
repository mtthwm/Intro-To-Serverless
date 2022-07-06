const fetch = require('node-fetch');

module.exports = async function (context, req) {
    const containerName = "images";
    const potentialExtensions = ['png', 'jpeg', 'jpg'];

    const username = req.headers.username;
    if (!username)
    {
        context.res = {
            status: 400,
            body: 'Please specify a username',
        }
        return;
    }

    let url;
    for (const extension of potentialExtensions)
    {
        url = await checkForFile(username, extension);
        if (url)
        {
            break;
        }
    }

    if (url)
    {
        context.res = {
            status: 200,
            body: {
                downloadUri: url,
                success: true,
            }
        }
    } 
    else
    {
        context.res = {
            status: 404,
            body: {
                downloadUri: '',
                success: false,
            }
        }
    }
}

/**
 * Checks a blob storage container for a file with a given name and extension
 * @param {string} name 
 * @param {string} extension 
 * @param {string} container
 */
const checkForFile = async (name, extension) => {
    const url = `https://serverlesscampstorage.blob.core.windows.net/images/${name}.${extension}`;
    const response = await fetch(url, {method: 'GET'});

    if (response.status !== 404)
    {
        return url;
    }
}