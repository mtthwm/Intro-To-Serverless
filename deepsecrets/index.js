const CosmosClient = require("@azure/cosmos").CosmosClient;
const qs = require("qs");
const config = require('./config');
const dbContext = require('./dbContext')

const Secret = function (message) {
    this.message = message;
}

const createSecret = async (container, secretObject) => {
    const { resources: createdItem } = await container.items.create(secretObject);

    return createdItem;
};

module.exports = async function (context, req) {
    // Production
    const queryObject = qs.parse(req.body);
    const messageBody = queryObject.Body;
    // End Production

    // // Debug
    // const messageBody = "THIS IS A VERY SECRET SECRET!!! " + Math.random();
    // // End Debug

    // Database Setup
    const {endpoint, key, databaseId, containerId} = config;

    const client = new CosmosClient({endpoint, key});

    const database = client.database(databaseId);
    const container = database.container(containerId);

    await dbContext.createDB(client, config);


    // Get the latest item
    const querySpec = {
        query: 'SELECT top 1 * FROM c order by c._ts desc',
    }

    const {resources: items} = await container.items
        .query(querySpec)
        .fetchAll();

    const lastSecret = items[0];

    // Save the secret
    await createSecret(container, new Secret(messageBody));

    if (lastSecret && lastSecret.message)
    {
        const responseMessage = `Thanks 😊! Stored your secret "${messageBody}". 😯 Someone confessed that: ${JSON.stringify(lastSecret.message)}`

        context.res = {
            status: 200, /* Defaults to 200 */
            body: responseMessage,
        }; 
    } 
    else
    {
        context.res = {
            status: 200,
            body: `Thanks 😊! Stored your secret "${messageBody}". 😯 No one else confessed anything!`,
        }
    }
}