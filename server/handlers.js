"use strict";
const { MongoClient } = require("mongodb");

const MONGO_URI =
  "mongodb+srv://user1:V4VjeJwtlYew92j7@cluster0.7qjdc.mongodb.net/m7-2?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};

const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};
  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);
    const seatId = `${getRowName(row)}-${seat + 1}`;
    bookedSeats[seatId] = true;
    num--;
  }
  return bookedSeats;
};

const getSeats = async (req, res) => {
  var array = [];
  const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
  for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
      array.push(`${row[r]}-${s}`);
    }
  }

  try {
    const randSeats = randomlyBookSeats(30);
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("m7-2");
    const seats = await db.collection("seats").find().toArray();
    seats.forEach((seat, i) => {
      if (randSeats[seat._id] === true) seats[i].isBooked = true;
      else seats[i].isBooked = false;
    });
    const finalSeats = renameKeys(seats, array);

    res.status(201).json({
      seats: finalSeats,
      bookedSeats: randSeats,
      numOfRows: 8,
      seatsPerRow: 12,
    });
    client.close();
  } catch (err) {
    console.log("Error: ", err);
  }
};

const bookSeat = async (req, res) => {

  try {
    const query = req.params._id;
    const newValues = { $set: { ...req.body } };
    const updatedSeatInfo = { $set: { isBooked: true, price: 225 } };
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("m7-2");
    await db.collection("orders").insertOne(req.body);
    await db.collection("seats").updateOne({ _id: seatId }, updatedSeatInfo);
    res.status(201).json({ ...req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

module.exports = { getSeats, bookSeat };
