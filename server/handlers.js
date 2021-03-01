'use strict';

const { MongoClient } = require ('mongodb');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const getSeats = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);

    await client.connect();
  
    const db = client.db('exercise_1');
    const col = db.collection('ticket_booker');

    await col.find().toArray((err, result) => {
      if (result.length > 0) {
        const seats = {};

        result.forEach(seat => {
          seats[seat._id] = {
            price: seat.price,
            isBooked: seat.isBooked
          }
        });

        res.status(200).json({ seats, numOfRows: NUM_OF_ROWS, seatsPerRow: SEATS_PER_ROW });
      } else {
        res.status(404).json({ status: 404, data: 'Not found' });
      }

      client.close();
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const bookSeat = async (req, res) => {
  const { seatId, creditCard, expiration } = req.body;

  if (!creditCard || !expiration) {
    res.status(400).json({ status: 400, message: 'Please provide credit card information!'})
  } else {
    try {
      const client = new MongoClient(MONGO_URI, options);

      await client.connect();
  
      const db = client.db('exercise_1');
      const col = db.collection('ticket_booker');

      await col.findOne({ _id: seatId }, (err, result) => {
        if (result) {
          if (result.isBooked) {
            res.status(400).json({ message: 'This seat has already been booked!' })
          } else {
            if (updateBooking(req.body)) {
              res.status(200).json({ success: true });
            } else {
              res.status(400).json({ status: 400, message: 'Record not updated' });
            }
          }
        } else {
          res.status(404).json({ status: 404, message: 'Seat not found'} );
        }

        client.close();
      });
    } catch (err) {
      res.status(500).json({ status: 500, message: err.message });
    }
  }
};

const updateBooking = async ({ seatId, creditCard, expiration }) => {
  const updateValue = { $set: { isBooked: true }};
  
  try {
    const client = new MongoClient(MONGO_URI, options);

    await client.connect();

    const db = client.db('exercise_1');
    const col = db.collection('ticket_booker');

    const updateResult = await col.updateOne({ _id: seatId }, updateValue);

    if (updateResult.modifiedCount === 1) {
      client.close();
      return true;
    } else {
      client.close();
      return false;
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = { getSeats, bookSeat };
