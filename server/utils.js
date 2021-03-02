
const assert = require("assert");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

const seatsImport = async ()=>{ 

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
    
   const client = await MongoClient(MONGO_URI, options);    
      
   try {
      // TODO: connect...
        await client.connect();
      // TODO: declare 'db'
        const db = client.db('ticket_booker');
     
        const result = await db.collection("seats").insertMany(seats);
        assert.equal(seats.length, result.insertedCount);
      // On success, send
        console.log({ status: 201, data: seats });

    } catch (err) {
        console.log(err.stack);
        console.log({ status: 500, data: seats, message: err.message });
    }  
    client.close(); 
};

seatsImport();