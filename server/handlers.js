'use strict';
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;


const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };


const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("seat_database");
  console.log("connected!");

  const seats = {}
  const results = await db.collection("seats").find().toArray();

  results.forEach((result) => {
    seats[result._id] = {
      price: result.price,
      isBooked: result.isBooked,
    }
  });

  client.close();
  return seats;

};


const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("seat_database");
  const { seatId, creditCard, expiration, fullName, email } = req.body;

  db.collection("seats").findOne({ _id: seatId }).then(async (result) => {
    if (!result.isBooked && creditCard && expiration && fullName && email) {
      const bookingSuccess = await db.collection("seats").updateOne({ _id: seatId }, {$set: { isBooked: true, name: fullName, email: email }});
      res.status(200).json({ 
        status: 200, 
        result: { bookingSuccess }, 
        message: "You have successfully booked a seat!",
      });
    } else if (!creditCard || !expiration) {
      res.status(400).json({
        status: 400,
        message: "Please provide credit card information.",
      });
    } else if (!fullName) {
      res.status(400).json({
        status: 400,
        message: "Please provide your name.",
      })
    } else if (!email) {
       res.status(400).json({
         status: 400,
         message: "Please provide your email.",
       })
    } else {
      res.status(400).json({
        status: 400,
        message: "That seat is unavailable.",
      })
    }

    client.close();

  });
}

module.exports = { getSeats, bookSeat };
