const fs = require('file-system');
const assert = require("assert");
const { MongoClient } = require("mongodb"); 
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Code that is generating the seats.
// ----------------------------------
let seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
        seats [`${row[r]}-${s}`] = {
        _id: `${row[r]}-${s}`,
        price: 225,
        isBooked: false,
        };
    }
}
const seatsArray = Object.values(seats);
// ----------------------------------
// Code that is generating the booked seats.
const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12; 

const getRowName = (rowIndex) => {
    return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
    const bookedSeats = {};

    while (num > 0) {
        const row = Math.floor(Math.random() * NUM_OF_ROWS);
        const seat = Math.floor(Math.random() * SEATS_PER_ROW);
        const seatId = `${getRowName(row)}-${seat + 1}`;
        bookedSeats[seatId] = true;
        num--;
    }
    return bookedSeats;
};

const bookedSeats = randomlyBookSeats(30); 
const bookedSeatsArray = Object.keys(bookedSeats).map((key)=>{
    return {_id: key};
});
// ----------------------------------

const batchImport = async (collection,data)=> {
    // data format has to be an array
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("mongo_cont");
        const result = await db.collection(collection).insertMany(data);
        const dataLength = data.length;
        assert.equal(dataLength, result.insertedCount);

        if(result.insertedCount===dataLength) {
            console.log(`${dataLength} documents inserted`);
        } else {
            console.log("Error. Documents not inserted");
        };
    
    } catch (err) {
        console.log(err.stack);
    }
    
    client.close();
    console.log("disconnected!");
};

// batchImport("seats",seatsArray);
// batchImport("bookedSeats",bookedSeatsArray);