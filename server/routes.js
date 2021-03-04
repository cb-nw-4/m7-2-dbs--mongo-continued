const router = require("express").Router();
const {
  getSeats,
  bookSeat,
  deleteBooking,
  updateUserInfo,
} = require("./handlers");

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

router.get("/api/seat-availability", getSeats);
router.post("/api/book-seat", bookSeat);
router.delete("/api/delete-seat", deleteBooking);
router.patch("/api/update-user", updateUserInfo);

module.exports = router;
