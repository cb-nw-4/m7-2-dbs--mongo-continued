const fs = require("file-system");

const { MongoClient } = require("mongodb");

const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbName = "m7-2-dbs--mongo-continued-exercises";

const batchImport = async (seats, bookedSeats) => {
  //console.log(seats);
  //console.log(bookedSeats);

  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db(dbName);
    // get number of seats in collection
    const seatCount = await db.collection("seats").countDocuments();

    // if existing seats, delete and get new seats array every time you restart the server
    // for clean slate (no previous reservations)
    if (seatCount > 0) {
      await db.collection("seats").deleteMany({});
    }
    // add id
    const seatsArray = Object.entries(seats).map(([key, value]) => {
      return {
        _id: key,
        price: value.price,
        isBooked: bookedSeats[key] || value.isBooked,
      };
    });

    //console.log(seatsArray);

    const results = await db.collection("seats").insertMany(seatsArray);
    //console.log(results);
    //assert.strictEqual(seats.length, result.insertedCount);
    //console.log(results);
    //res.status(201).json({ status: 201, data: results });
  } catch (err) {
    console.log(err.stack);
    //res.status(500).json({ status: 500, message: err.message });
  } finally {
    client.close();
  }
};

module.exports = { batchImport, dbName };
