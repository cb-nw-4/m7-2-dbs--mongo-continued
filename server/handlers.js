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

    result
      ? res.status(200).json({
          seats: result,
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

module.exports = { getSeats };
