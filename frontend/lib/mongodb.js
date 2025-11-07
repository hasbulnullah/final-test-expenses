const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db('mongodb://localhost:27017/');

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();