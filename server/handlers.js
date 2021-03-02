'use strict';
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const getSeats = async (req, res) => {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("ticket_booker");
    const result = await db.collection("seats").find().toArray();

    const convertArrayToObject = (array, key) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]: item,
            };
        }, initialValue);
    }

    const resultObj = convertArrayToObject(result, "_id");

    res.status(200).json({ 
        seats: resultObj,
        numOfRows: 8,
        seatsPerRow: 12,
    });
};

const updateSeat = async (req, res) => {
    const { seatId, creditCard, expiration, fullName, email } = req.body;
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("ticket_booker");

    if (!creditCard || !expiration) {
        return res.status(400).json({
            status: 400,
            message: "Please provide credit card information!",
        });
    }

    const result = await db.collection("seats").findOne({ _id: seatId });

    if (result.isBooked === true) {
        return res.status(400).json({
            message: "This seat has already been booked!",
        });
    }

    else if (result.isBooked === false) {
        const _id = seatId;
        const query = { _id };
        const newValues = { 
            isBooked: true,
            purchased_by: fullName,
            client_email: email
        };
        try {
            await db.collection("seats").updateOne(query, { $set: newValues });
            res.status(200).json({ status: 200, success: true });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: err.message });
        }
        client.close();
    }
};

module.exports = { getSeats, updateSeat };
