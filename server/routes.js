const router = require("express").Router();
const fs = require("file-system");
const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const { getSeats, bookSeat } = require("./handlers");

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// Code that is generating the seats.
// ----------------------------------
const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      price: 225,
      isBooked: false,
    };
  }
}
// ----------------------------------
//////// HELPERS
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

let state;

if (!state) {
  state = {
    bookedSeats: randomlyBookSeats(30),
  };
}

const batchImport = async (seats, bookedSeats) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("ticketbooking");
    const seatsArray = Object.entries(seats).map(([_id, seat]) => {
      return {
        _id,
        price: seat.price,
        isBooked: bookedSeats[_id] || seat.isBooked,
      };
    });

    console.log(seatsArray);
    const seatCount = await db.collection("seats").countDocuments();

    if (seatCount > 0) {
      await db.collection("seats").deleteMany({});
    }
    const results = await db.collection("seats").insertMany(seatsArray);
    console.log("connected");
  
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.close();
    console.log("disconnected!");
  }
};

batchImport(seats, state.bookedSeats);
router.get("/api/seat-availability", async (req, res) => {
  const seats = await getSeats();

  return res.json({
    seats: seats,

    bookedSeats: state.bookedSeats,

    numOfRows: 8,

    seatsPerRow: 12,
  });
});

let lastBookingAttemptSucceeded = false;

router.post("/api/book-seat", async (req, res) => {
  const { creditCard, expiration } = req.body;



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
  await bookSeat(req, res, state);

});

if (!state) {
  state = {
    bookedSeats: randomlyBookSeats(30),
  };
}

module.exports = router;
