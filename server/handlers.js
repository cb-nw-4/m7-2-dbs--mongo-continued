const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  console.log("connected");
  const db = client.db("ticketbooking");
  const seats = {};
  const results = await db.collection("seats").find().toArray();

  results.forEach((result) => {
    seats[result._id] = {
      price: result.price,
      isBooked: result.isBooked,
    };
  });
  client.close();
  return seats;
};

const getReservations = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  console.log("connected");
  const db = await client.db("ticketbooking");
  const seats = {};
  const results = await db.collection("newBooking").find().toArray();
  results.forEach((result) => {
    seats[result._id] = {
      email: result.email,
      fullName: result.fullName,
    };
  });
  client.close();
  return seats;
};

const bookSeat = async (req, res, state) => {
  const { seatId, email, fullName } = req.body;
  const client = await MongoClient(MONGO_URI, options);
  console.log(email, fullName);
  await client.connect();

  const db = await client.db("ticketbooking");

  const findResult = await db
    .collection("seats")
    .findOne({ _id: seatId })
    .then((result) => {
      if (result.isBooked == true) {
        res.status(400).json({
          status: 400,
          message: "This seat is already taken ",
        });
      } else {
        return {
          $set: { ...result, isBooked: true, email: email, fullName: fullName },
        };
      }
    });

  await db
    .collection("seats")
    .updateOne({ _id: seatId }, findResult)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "success",
        data: result,
      });
    });

  await db
    .collection("newBooking")
    .insertOne({ _id: seatId, email: email, fullName: fullName });
  state.bookedSeats[seatId] = true;

  client.close();
};

const deleteBooking = async (req, res) => {
  const _id = req.params._id;
  console.log(_id);
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("ticketbooking");
    db.collection("newBooking").deleteOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: "Not Found" });
      client.close();
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const updateBooking = async (req, res, state) => {
  const { email, fullName } = req.body;
  const _id = req.params._id;
  console.log(_id);

  console.log(email);
  console.log(fullName);
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = await client.db("ticketbooking");
    const result = await db
      .collection("newBooking")
      .updateOne({ _id }, { $set: { email: email, fullName: fullName } });

    res.status(200).json({ status: 200, _id, data: result });

    client.close();
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};
module.exports = {
  getSeats,
  getReservations,
  bookSeat,
  deleteBooking,
  updateBooking,
};
