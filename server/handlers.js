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

getSeats();

module.exports = { getSeats };
