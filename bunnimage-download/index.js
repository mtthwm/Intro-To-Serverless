const {BlobServiceClient} = require('@azure/storage-blob');

module.exports = async function (context, req) {
    const containerName = "images";
    const potentialExtensions = ['png', 'jpeg', 'jpg'];
    console.log("->", req.headers);
    const username = req.headers.username;
    if (!username)
    {
        context.res = {
            status: 400,
            body: 'Test!! Please specify a username',
        }
        return;
    }

    let url;
    for (const extension of potentialExtensions)
    {
        url = await checkForFile(username, extension, containerName);
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
                downloadUri: null,
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
const checkForFile = async (name, extension, container) => {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_STORAGE_CONNECTION_STRING);
    const containerClient = await blobServiceClient.getContainerClient(container);
    const blobClient = await containerClient.getBlockBlobClient(`${name}.${extension}`);

    const fileExists = await blobClient.exists();
    if (fileExists) {
        return blobClient.url;
    } else {
        return null;
    }
}