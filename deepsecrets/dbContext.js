const createDB = async (client, configObject) => {
    // Create the database if it does not exist
    const {database} = await client.databases.createIfNotExists({
        id: configObject.databaseId,
    })
    console.log(`Created database:\n${database.id}\n`);

    // Create a container if it doesn't exist
    const { container } = await client
        .database(configObject.databaseId)
        .containers.createIfNotExists(
            {id: configObject.containerId, partitionKey: configObject.partitionKey},
            {offerThroughput: 400}
        );

    console.log(`Created container:\n${container.id}\n`);
};

module.exports = {createDB};