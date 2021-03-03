"use strict";

const { MongoClient } = require("mongodb");
const delay = require("delay");

//const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// To test if connected:
// const dbFunction = async (dbName) => {
//   creates a new client
//   const client = await MongoClient(MONGO_URI, options);
//   connect to the client
//   await client.connect();
//   connect to the database (db name is provided as an argument to the function)
//   const db = client.db(dbName);
//   console.log("connected!");
//   close the connection to the database server
//   client.close();
//   console.log("disconnected!");
// };
// dbFunction("seats");

const getSeats = async (req, res) => {
  //console.log(NUM_OF_ROWS, SEATS_PER_ROW);
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("m7-2-dbs--mongo-continued-exercises");

    const seatsResult = await db.collection("seats").find().toArray();
    //console.log(seatsResult);
    let seats = {};
    seatsResult.forEach((seat) => {
      seats[seat._id] = seat;
    });
    //console.log(seats);

    res.status(200).json({
      status: 200,
      seats,
      numOfRows: NUM_OF_ROWS,
      seatsPerRow: SEATS_PER_ROW,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500 });
  } finally {
    client.close();
  }
};

let lastBookingAttemptSucceeded = false;

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { fullName, email, seatId, creditCard, expiration } = req.body;
  console.log(req.body);

  await delay(Math.random() * 3000);

  if (!fullName || !email) {
    return res.status(400).json({
      status: 400,
      message: "Please provide full name and/or email address!",
    });
  }

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: "Please provide credit card information!",
    });
  }

  if (lastBookingAttemptSucceeded) {
    lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

    return res.status(500).json({
      message: "An unknown error has occurred. Please try your request again.",
    });
  }

  lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

  try {
    await client.connect();

    const db = client.db("m7-2-dbs--mongo-continued-exercises");

    db.collection("seats").findOne({ _id: seatId }, (err, result) => {
      //console.log(result);
      if (result.isBooked) {
        res.status(404).json({
          status: 404,
          seatId,
          data: "This seat has already been booked!",
        });
      }
    });

    // prettier-ignore
    const seatBooked = await db.collection("seats")
      .updateOne({ _id: seatId }, { $set: { "isBooked": true, "Full Name": fullName, "Email": email } });

    if (seatBooked) {
      res.status(200).json({ status: 200, success: true });
    }
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = { getSeats, bookSeat };
