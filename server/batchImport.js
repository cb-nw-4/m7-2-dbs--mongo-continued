const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const seats = [];
const generateSeats = () => {
  const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
  for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
      seats.push({
        _id: `${row[r]}-${s}`,
        price: 225,
        isBooked: false,
      });
    }
  }
};

const batchImport = async () => {
  generateSeats();
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("ticket_booker");

    const result = await db.collection("flight").insertMany(seats);
    assert.equal(seats.length, result.insertedCount);
    console.log("SUCCESS", result);
  } catch (err) {
    console.log("ERROR", err.message);
  }
  client.close();
};

batchImport();
