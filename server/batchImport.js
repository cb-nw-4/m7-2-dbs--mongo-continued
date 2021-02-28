const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_URI, options);

const batchImport = async (seats) => {
  const seatsInfo = Object.entries(seats).map(([_id, seat]) => ({
    _id,
    ...seat,
  }));

  console.log(seatsInfo);

  try {
    const dbName = "ticket-booker";

    await client.connect();

    const db = client.db(dbName);
    console.log("connected");

    const seatsCollection = await db.collection("seats").find().toArray();

    const result = await db.collection("seats").insertMany(seatsInfo);
    assert.equal(seatsInfo.length, result.insertedCount);

    console.log(result, "success");
  } catch (err) {
    console.log(err);
  }

  client.close();
  console.log("disconnected!");
};

module.exports = { batchImport };
