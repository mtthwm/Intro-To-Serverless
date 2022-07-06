const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, ".env") });
const {BlobServiceClient} = require('@azure/storage-blob');

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    const containerName = 'images';
    const blobService = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const container = blobService.getContainerClient(containerName);

    context.log('Beginning delete...')
    for await (const blob of container.listBlobsFlat()) {
        await container.deleteBlob(blob.name);
        context.log(`Deleting blob name ${blob.name}`);
    }
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('Deleted all blobs at/on: ', timeStamp);
};