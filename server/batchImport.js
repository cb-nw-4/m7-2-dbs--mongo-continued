const fs = require("file-system");

const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  try {
    const typeOfGreetings = greetings.length;
 
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  const result = await db.collection("typeOf").insertMany(greetings);
  assert.equal(typeOfGreetings, result.insertedCount);
  console.log('success')
} catch (err) {
  console.log(err.stack);

}
client.close();
}
batchImport();
