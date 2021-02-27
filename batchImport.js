const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (seats) => {
  const seatPairs = Object.entries(seats);

  const cleaned = seatPairs.map(([_id, seat]) => {
    return { _id, ...seat };
  });
  console.log(seats);
  const seatIds = Object.keys(seats);
  // console.log(seatIds);
  const clean = seatIds.map((_id) => ({
    _id,
    ...seats[_id],
  }));

  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = await client.db("ticketbooker");

  const result = await db.collection("seats").find().toArray();

  if (result.length == 0) {
    await db.collection("seats").insertMany(clean);
  }

};

module.exports = { batchImport };
