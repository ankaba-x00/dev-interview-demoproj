import { MongoClient } from 'mongodb';

const url = 'mongodb://mongo-user:27017';
const client = new MongoClient(url);

await client.connect();
const db = client.db('userdb');

// idempotent
await db.createCollection('users').catch(() => {});
console.log('DB initialized');

await client.close();
