"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// const NUM_OF_ROWS = 8;
// const SEATS_PER_ROW = 12;
// const getRowName = (rowIndex) => {
//   return String.fromCharCode(65 + rowIndex);
// };

// const randomlyBookSeats = (num) => {
//   const bookedSeats = {};

//   while (num > 0) {
//     const row = Math.floor(Math.random() * NUM_OF_ROWS);
//     const seat = Math.floor(Math.random() * SEATS_PER_ROW);

//     const seatId = `${getRowName(row)}-${seat + 1}`;

//     bookedSeats[seatId] = true;

//     num--;
//   }

//   return bookedSeats;
// };

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("booking_system");
    const result = await db.collection("seats").find().toArray();
    // console.log(result);
    let seats = {};
    result.forEach((seat) => {
      //   console.log(seat);
      seats[seat._id] = seat;
    });
    // console.log(seats);
    res.status(200).json({
      seats: seats,
      bookedSeats: result,
      numOfRows: 8,
      seatsPerRow: 12,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });
  }
  client.close();
};

let lastBookingAttemptSucceeded = false;

const bookSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { seatId, creditCard, expiration } = req.body;

  await client.connect();
  const db = client.db("booking_system");

  const selectedSeat = await db.collection("seats").findOne({ _id: seatId });

  if (selectedSeat.isBooked) {
    return res.status(400).json({
      message: "This seat has already been booked!",
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

  const newValues = { $set: { isBooked: true } };
  const updateSelectedSeat = await db
    .collection("seats")
    .updateOne({ _id: seatId }, newValues);
  assert.strictEqual(1, updateSelectedSeat.matchedCount);
  assert.strictEqual(1, updateSelectedSeat.modifiedCount);

  return res.status(200).json({
    status: 200,
    success: true,
  });
};

module.exports = { getSeats, bookSeats };
