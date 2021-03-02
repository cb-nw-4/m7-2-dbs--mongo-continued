const {
  getSeats,
  bookSeats,
  deleteBooking,
  updateBooking,
} = require("./handlers");

const router = require("express").Router();

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat", bookSeats);

router.delete("/api/delete-seat/:_id", deleteBooking);

router.put("/api/seat-update/:_id", updateBooking);

module.exports = router;
