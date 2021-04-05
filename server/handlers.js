"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(MONGO_URI, options);

const getSeats = async (req, res) => {
  try {
    const dbName = "ticket-booker";

    await client.connect();

    const db = client.db(dbName);
    console.log("connected");

    const seats = await db.collection("seats").find().toArray();

    return seats;
  } catch (err) {
    console.log(err);
  }

  client.close();
  console.log("disconnected!");
};

// const handleBooking = async (req, res) => {
//   try {
//     const dbName = "ticket-booker";
//     const _id = req.params._id;
//     const newValues = { $set: { isBooked: req.body.isBooked } };

//     await client.connect();

//     const db = client.db(dbName);
//     console.log("connected");

//     const results = await db.collection("seats").updateOne({ _id }, newValues);
//     assert.equal(1, results.matchedCount);
//     assert.equal(1, results.modifiedCount);

//     res.status(201).json({ status: 204, message: results });
//   } catch (err) {
//     console.log(err.stack);
//     res.status(500).json({ status: 500, message: err.message });
//   }
//   client.close();
//   console.log("disconnected!");
// };

const handleBooking = async (req, res) => {
  const dbName = "ticket-booker";
  const { _id, creditCard, expiration, fullName, email } = req.body;

  await client.connect();

  const db = client.db(dbName);
  console.log("connected");

  db.collection("seats").findOne({ _id }, (err, result) => {
    if (result.isBooked === true) {
      res.status(400).json({
        status: 400,
        data: result,
        message: "Seat is already booked.",
      });
    } else if (!creditCard || !expiration || !fullName || !email) {
      res.status(400).json({
        status: 400,
        data: result,
        message:
          "Missing information! Please fill out missing information before booking the seat.",
      });
    } else if (result.isBooked === false) {
      db.collection("seats").updateOne({ _id }, { $set: { isBooked: true } });
      res.status(200).json({ status: 200, data: result });
    }
  });
};

module.exports = { getSeats, handleBooking };
