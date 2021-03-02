'use strict';
const { MongoClient } = require('mongodb');
require('dotenv').config();


const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}

const assert = require('assert');
const { promises } = require('fs');

// ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
    return String.fromCharCode(65 + rowIndex);
    };
    const NUM_OF_ROWS = 8;
    const SEATS_PER_ROW = 12;

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

    let state;


const getSeats = async (req, res) => {

    const client = await MongoClient(MONGO_URI, options);

    
    try{
        await client.connect();

        const db = client.db('exercise_2');

        const result = await db.collection("reservations").find().toArray();

        let seats ={} ;

        result.map(item => seats[item._id] = {
            price: item.price,
            isBooked: item.isBooked
        })


        if (!state) {
                state = {
                bookedSeats: randomlyBookSeats(30),
                };
            }

        res.status(200).json({
            status: 200, 
            seats: seats,
            bookedSeats: state.bookedSeats,
            numOfRows: 8,
            seatsPerRow: 12,
        
        });


    }catch(error){
        console.log(error)
        res.status(500).json({ status: 500, message: error.message });
    }
    
    client.close();
    console.log("Disconnected!!")

};



let lastBookingAttemptSucceeded = false;


const bookSeat = async(req, res)=>{
    const client = await MongoClient(MONGO_URI, options);

    const {fullName, email, seatId, creditCard, expiration} = req.body;

    try{

        await client.connect();

        const db = client.db('exercise_2');

        if (!state) {
            state = {
                bookedSeats: randomlyBookSeats(30),
            };
            }
        
            // await delay(Math.random() * 3000);
        
            const isAlreadyBooked = !!state.bookedSeats[seatId];
            if (isAlreadyBooked) {
            return res.status(400).json({
                message: "This seat has already been booked!",
            });
            }
        
            if (!creditCard || !expiration) {
            return res.status(400).json({
                status: 400,
                message: "Please provide credit card information!",
            });
            }

        if (lastBookingAttemptSucceeded) {
            lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;
        
            return res.status(500).json({
                message: "An unknown error has occurred. Please try your request again.",
            });
            }
        
            lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;
        
            state.bookedSeats[seatId] = true;

        
            const newValues = { $set: { isBooked: true}};

            const query = {_id: seatId }


            const result = await db.collection("reservations").updateOne(query, newValues)

            const dataInfo = await db.collection('info').insertOne(req.body);
            assert.strictEqual(1, result.insertedCount);


            return res.status(200).json({
                    status: 200,
                    success: true,
                    data: dataInfo
            });


    }catch(error){
        console.log('error', error)

    }

    client.close();
    console.log("Disconnected")

} 



const deleteBook = async (req, res) =>{

    const client = await MongoClient(MONGO_URI, options);

    const seatId = req.params.seatId.toUpperCase();

    try{
        await client.connect();
        const db = client.db('exercise_2');


        const newValues = { $set: { isBooked: false}};

        const query1 = {_id: seatId }

        const query= {seatId : seatId}

        const result = await db.collection("reservations").updateOne(query1, newValues)

        const resultInfo = await db.collection("info").deleteOne(query)
    

        if( resultInfo.deletedCount === 1){
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'the document was delete with success'})

            }
            else{
                throw("the document with giver Id can't be Deleted!! verify the Id and try again")
            }
    
        
    }
    catch(error){
        console.log(error)
        res.status(500).json({ status: 500, data: error});
    }

}

const updateInfo = async(req, res) =>{

    const client = await MongoClient(MONGO_URI, options);

    const seatId = req.params.seatId.toUpperCase();

    const query = {seatId};
    const newValues = { $set: { ...req.body } };

    try{

        await client.connect();
        const db = client.db('exercise_2');

        if(req.body.email || req.body.fullName){
            const result = await db.collection("info").updateOne(query, newValues)
            assert.strictEqual(1, result.matchedCount);
            assert.strictEqual(1, result.modifiedCount);
            
            res.status(200).json({ status: 200, seatId, ...req.body });

        }else{
            throw('must modify the email or fullName of the client')
        }



    }catch(error){

        console.log(error)
        res.status(500).json({ status: 500, data: error});
    }


}

module.exports = { getSeats, bookSeat, deleteBook, updateInfo };
