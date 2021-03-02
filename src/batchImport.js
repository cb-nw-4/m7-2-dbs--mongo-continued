const fs = require("file-system");
const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// const seats = JSON.parse(fs.readFileSync(""))

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

const seatsArray = Object.values(seats);
console.log(seatsArray);

const batchImport = async () => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = client.db("seat_database");
    console.log("connected!");

    const result = await db.collection("seats").insertMany(seatsArray);
    assert.equal(seatsArray.length, result.insertedCount)
    console.log("Seats have been added!")
  } catch (err) {
    console.log("There was an error adding the seats.");
  }
}

batchImport();
