const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, ".env") });
const fetch = require('node-fetch');
const parseMultipart = require('parse-multipart');
const {BlobServiceClient} = require('@azure/storage-blob')

module.exports = async function (context, req) {
    const parts = readMultipartRequest(req);

    // const uploadResponse = await uploadFile('test', getFileExtension(parts[0]), parts[0]);

    context.res = {
        'body': 'File Saved'
    };
}

const getFileExtension = (requestPart) => {
    const extensionMap = {
        'image/png': 'png',
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpg',
    };

    const extension = extensionMap[requestPart.type];
    if (!extension)
    {
        return '';
    }

    return extension;
};

const readMultipartRequest = (req) => {

    // Read parts of the request individually.
    const boundary = parseMultipart.getBoundary(req.headers['content-type']);
    const body = req.body;
    const parts = parseMultipart.Parse(body, boundary);

    return parts;
};

const uploadFile = async (name, extension, requestPart) => {

    // Upload the image
    const blobServiceInstance = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const container = await blobServiceInstance.getContainerClient(process.env.BLOB_CONTAINER_NAME);
    const blob = await container.getBlockBlobClient(`${name}.${extension}`);

    const postUploadResponse = await blob.upload(requestPart.data, requestPart.data.length);

    return postUploadResponse;
};