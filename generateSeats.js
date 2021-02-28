const assert = require('assert');
const { MongoClient } = require ('mongodb');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// generate seats (adapted from m6-1-react-reducers)
const seats = [];
const pricingOptions = [500, 500, 400, 350, 250, 250, 175, 125];
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];

for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats.push({
      _id: row[r] + '-' + s,
      price: pricingOptions[r],
      isBooked: false
    });
  }
}

const client = new MongoClient(MONGO_URI, options);

const generateSeats = async () => {
  try {
    await client.connect();
  
    const db = client.db('exercise_1');
    const col = db.collection('ticket_booker');

    const result = await col.insertMany(seats);

    assert.notStrictEqual(0, result.insertedCount);
    console.log('Inserted ' + result.insertedCount + ' records.');

    await client.close();

  } catch (err) {
    console.log('Error inserting records: ' + err);
  }
};

generateSeats();
