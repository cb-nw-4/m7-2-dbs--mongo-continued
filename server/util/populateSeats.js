const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const populateSeats = async (seats) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected");
    const db = client.db("Ticket_Booker");
    const seatInfo = Object.values(seats);
    const result = await db.collection("seats").insertMany(seatInfo);
    assert.strictEqual(84, result.insertedCount);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
    console.log("disconnected");
  }
};

module.exports = { populateSeats };
