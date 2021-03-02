const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


const batchImport = async (seats, bookedSeats) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("seat_database");

  const seatsCollectionCount = await db.collection("seats").countDocuments();
  if (seatsCollectionCount > 0) {
    await db.collection("seats").deleteMany({})
  }

  const seatsKeysArray = Object.keys(seats);

  const newSeats = seatsKeysArray.map((seatKey) => {
    return {
      _id: seatKey,
      price: seats[seatKey].price,
      isBooked: bookedSeats[seatKey] ? true : false
    }
  })

  await db.collection("seats").insertMany(newSeats);

  console.log("Seats have been added!")

  client.close();
}

module.exports = {
  batchImport
}
