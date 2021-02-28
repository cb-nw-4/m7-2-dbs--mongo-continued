const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");
// const data = require("./routes");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    };
  }
}

const batchImport = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  console.log(seats);
  try {
    await client.connect();

    const db = client.db("booking_system");
    console.log("connected!");

    const result = await db
      .collection("seats")
      .insertMany(Object.values(seats));
    assert.strictEqual(seats.length, result.insertedCount);

    res
      .status(201)
      .json({ status: 201, data: result, message: "Collection added" });
  } catch (err) {
    console.log(err.stack);
    res
      .status(500)
      .json({ status: 500, data: greetings, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

batchImport();
