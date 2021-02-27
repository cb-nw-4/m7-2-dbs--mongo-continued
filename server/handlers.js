"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = await client.db("ticketbooker");

  const seats = {};
  const results = await db.collection("seats").find().toArray();

  results.forEach((result) => {
    seats[result._id] = {
      price: result.price,
      isBooked: result.isBooked,
    };
  });
  console.log(seats);
  client.close();
  return seats;

  // res.status(200).json({
  //   data: users,
  // });

  // console.log(users);

  // if (!state) {
  //   state = {
  //     bookedSeats: randomlyBookSeats(30),
  //   };
  // }

  // return res.json({
  //   seats: seats,
  //   bookedSeats: state.bookedSeats,
  //   numOfRows: 8,
  //   seatsPerRow: 12,
  // });
};

module.exports = { getSeats };
