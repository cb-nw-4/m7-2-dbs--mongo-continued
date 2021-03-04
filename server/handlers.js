"use strict";
const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("ticket_booker");
    console.log("connect");

    const result = await db.collection("flight").find().toArray();

    let allSeats = {};
    result.forEach((seat) => {
      allSeats[seat._id] = seat;
    });

    result
      ? res.status(200).json({
          seats: allSeats,
          bookedSeats: {},
          numOfRows: 8,
          seatsPerRow: 12,
        })
      : res.status(404).json({ status: 404, data: "Not Found" });
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

const bookSeat = async (req, res) => {
  const { creditCard, expiration } = req.body;
  const _id = req.body.seatId;
  const email = req.body.email;
  const fullName = req.body.fullName;

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: "Please provide credit card information!",
    });
  }

  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("ticket_booker");
    const result = await db.collection("flight").findOne({ _id });

    if (result) {
      if (!result.isBooked) {
        const booking = await db
          .collection("flight")
          .updateOne({ _id }, { $set: { isBooked: true, email, fullName } });
        res.status(200).json({ status: 200, success: true });
      } else {
        res.status(400).json({
          message: "This seat has already been booked!",
        });
      }
    } else {
      res.status(404).json({ status: 404, data: "Seat not Found" });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

module.exports = { getSeats, bookSeat };
