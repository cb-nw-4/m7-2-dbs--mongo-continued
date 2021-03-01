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
          message: "reservation working",
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
    .collection('newBooking')
.insertOne({ _id: seatId, email, fullName })
  state.bookedSeats[seatId] = true;

  client.close();
};

module.exports = { getSeats, bookSeat };
