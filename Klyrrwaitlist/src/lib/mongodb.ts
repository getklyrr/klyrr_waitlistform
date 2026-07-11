import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  // We only throw when actually connecting, not at import time, so builds
  // don't fail if the env var isn't set yet in a preview environment.
  console.warn("MONGODB_URI is not set. Set it in your Netlify environment variables.");
}

// In serverless environments a new connection is created per cold start.
// We cache the promise on globalThis so warm invocations reuse the connection.
type MongoGlobal = typeof globalThis & {
  _klyrrMongoClientPromise?: Promise<MongoClient>;
};

const globalWithMongo = globalThis as MongoGlobal;

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!globalWithMongo._klyrrMongoClientPromise) {
    const client = new MongoClient(uri);
    globalWithMongo._klyrrMongoClientPromise = client.connect();
  }
  return globalWithMongo._klyrrMongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db("klyrr");
}

export async function getCompetitionsCollection() {
  const db = await getDb();
  return db.collection("competitions");
}
