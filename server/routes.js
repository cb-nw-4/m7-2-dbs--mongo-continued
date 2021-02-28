const { getSeats, bookSeats } = require("./handlers");

const router = require("express").Router();

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat", bookSeats);

module.exports = router;
