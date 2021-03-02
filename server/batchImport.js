const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require("assert");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const batchImport = async (seats) => {
    const client = await MongoClient(MONGO_URI, options);
    const seatArr = Object.keys(seats);
    try {
        for (let i = 0; i < seatArr.length; i++) {
            const data = {
                _id: seatArr[i],
                price: seats[seatArr[i]].price,
                isBooked: seats[seatArr[i]].isBooked
            }
            await client.connect();
            const db = client.db("ticket_booker");
            const result = await db.collection("seats").insertOne(data);
            assert.equal(1, result.insertedCount);
            console.log({ status: 201, data: data });
        }
    } catch (err) {
        console.log(err.stack);
    }
    client.close();
}

module.exports = { batchImport };
