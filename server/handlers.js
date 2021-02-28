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

module.exports = { getSeats };
