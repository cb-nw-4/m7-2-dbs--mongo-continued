const router = require("express").Router();
const { getSeats,  bookSeats, deleteBooking, modifyBooking } = require("./handlers");



// ----------------------------------
//////// HELPERS


router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat",  bookSeats);

router.delete("/api/book-seat/:id",  deleteBooking);

router.put("/api/book-seat/:id",  modifyBooking);


module.exports = router;
