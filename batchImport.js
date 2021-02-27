const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (seats, bookedSeats) => {
  const seatPairs = Object.entries(seats);
  console.log(bookedSeats)
  const cleaned = seatPairs.map(([_id, seat]) => {
    return { _id, ...seat, isBooked: bookedSeats[_id] || seat.isBooked };
  });

  // const seatIds = Object.keys(seats);
  // const clean = seatIds.map((_id) => ({
  //   _id,
  //   ...seats[_id],
  // }));


  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = await client.db("ticketbooker");

  const seatCount = await db.collection("seats").countDocuments();

  if (seatCount > 0) {
    await db.collection("seats").deleteMany({})
  }

  await db.collection("seats").insertMany(cleaned);
};

module.exports = { batchImport };
