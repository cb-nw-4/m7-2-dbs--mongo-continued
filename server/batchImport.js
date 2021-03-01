const fs = require("file-system");

const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (seats, bookedSeats) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("ticketbooking");
    const seatsArray = Object.entries(seats).map(([_id, seat]) => {
      return {
        _id,
        price: seat.price,
        isBooked: bookedSeats[_id] || seat.isBooked,
      };
    });


    const seatCount = await db.collection("seats").countDocuments();

    if (seatCount > 0) {
      await db.collection("seats").deleteMany({});
    }
    const results = await db.collection("seats").insertMany(seatsArray);
    console.log("connected");
  
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.close();
    console.log("disconnected!");
  }
};

module.exports = { batchImport }
