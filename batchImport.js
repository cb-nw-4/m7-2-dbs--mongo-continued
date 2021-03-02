const { MongoClient } = require("mongodb");
var file = require("file-system");
var fs = require("fs");

const MONGO_URI =
  "mongodb+srv://user1:V4VjeJwtlYew92j7@cluster0.7qjdc.mongodb.net/m7-2?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async (dbName) => {
  try {
    const seats = [];
    const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (let r = 0; r < row.length; r++) {
      for (let s = 1; s < 13; s++) {
        seats.push({
          _id: `${row[r]}-${s}`,
          price: 225,
          isBooked: false,
        });
      }
    }
    console.log(seats);
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(dbName);
    await db.collection("seats").insertMany(seats);
    assert.strictEqual(seats.length, result.insertedCount);
    console.log("Status 201");
  } catch (err) {
    console.log("Status 500");
  }
};

batchImport("m7-2");
