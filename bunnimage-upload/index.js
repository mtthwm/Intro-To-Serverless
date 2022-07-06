const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, ".env") });
const fetch = require('node-fetch');
const parseMultipart = require('parse-multipart');
const {BlobServiceClient} = require('@azure/storage-blob')

module.exports = async function (context, req) {
    if (!req.body)
    {
        context.res = noImageResponse();
        return;
    }
    const parts = readMultipartRequest(req);
    if (!parts[0] || !parts[0].data)
    {
        context.res = noImageResponse();
        return;
    }

    const fileName = req.query.codename ? req.query.codename : 'untitled';
    const uploadResponse = await uploadFile(fileName, getFileExtension(parts[0]), parts[0]);

    context.res = {
        body: uploadResponse,
    };
}


const noImageResponse = () => {
    return {
        body: 'Sorry! No image attached.'
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
    const containerName = 'images';

    // Upload the image
    const blobServiceInstance = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const container = await blobServiceInstance.getContainerClient(containerName);
    const blob = await container.getBlockBlobClient(`${name}.${extension}`);

    const postUploadResponse = await blob.upload(requestPart.data, requestPart.data.length);

    return postUploadResponse;
};