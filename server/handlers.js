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
  const client = await MongoClient(MONGO_URI, option);
  await client.connect();
  const db = client.db("dbticket");
  db.collection("seats")
    .find()
    .toArray()
    .then((seats) => {
      const seatObject = {};
      seatObject.forEach((seat) => {
        seatObject[seat._id] = seat;
      });
      res.status(200).json({
        status: 200,
        data: {
          seats: seatObject,
          numOfRows: 8,
          seatPerRow: 12,
        },
      });
    })
    .catch((error) => {
      res.status(404).json({
        status: 404,
        data: "Seats not found",
        error,
      });
    })
    .finally(() => {
      client.close();
      console.log("disconnected");
    });
};

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("dbticket");
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  db.collection("seats")
    .findOne({ _id: seaId })
    .then(async (result) => {
      if (result.isBooked === false && creditCard && expiration) {
        const newSeat = await db
          .collection("seats")
          .updateOne(
            { _id: seatId },
            { $set: { isBooked: true, fullName, email } }
          );
        res.status(200).json({
          status: 200,
          result: { newSeat, fullName, email },
          message: "Success",
        });
      } else if (!creditCard || !expiration) {
        return res.status(400).json({
          status: 400,
          message: "Please enter credit card information",
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Seat unavailable",
          data: result,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      client.close();
      console.log("disconnected");
    });
};

module.exports = { getSeats, bookSeat };
