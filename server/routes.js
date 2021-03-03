const router = require("express").Router();
require("dotenv").config();

const {
  getSeats,
  getReservations,
  bookSeat,
  deleteBooking,
  updateBooking,
} = require("./handlers");
const { batchImport } = require("./batchImport");

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
console.log(seats);
if (!state) {
  state = {
    bookedSeats: randomlyBookSeats(30),
  };
}


router.get("/api/seat-availability", async (req, res) => {
  const seats = await getSeats();

  return res.json({
    seats: seats,

    bookedSeats: state.bookedSeats,

    numOfRows: 8,

    seatsPerRow: 12,
  });
});

router.get("/allReservations", async (req, res) => {
  const result = await getReservations();
  return res.json({
    result,
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

router.delete("/book-seat/:_id", deleteBooking);

router.patch("/book-seat/:_id", (req, res) => {
  updateBooking(req, res, state);
});
batchImport(seats, state.bookedSeats);
module.exports = router;
