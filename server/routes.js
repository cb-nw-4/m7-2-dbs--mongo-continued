const router = require("express").Router();
const { getSeats, bookSeat, getBookingBySeat, deleteBooking, updateBooking } = require("./handlers");

router.get("/api/seat-availability",getSeats);

router.post("/api/book-seat",bookSeat);

router.get("/api/booking/:seatId",getBookingBySeat);

router.delete("/api/delete-booking/:seatId",deleteBooking);

router.put("/api/update-booking/:seatId",updateBooking);

module.exports = router;
