const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: 'mtthwmrls',
    containerId: 'secrets',
    partitionKey: {kind: 'Hash', paths: ['/secrets']}
};

module.exports = config;