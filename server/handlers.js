'use strict';

const assert = require("assert");
const { MongoClient } = require("mongodb"); 
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("mongo_cont");
        const seats = await db.collection("seats").find().toArray();
        const bookedSeats = await db.collection("bookedSeats").find().toArray();

        // update isBooked in seats in accordance with bookedSeats 
        const updatedSeats = seats.map((seat)=>{
            bookedSeats.forEach((bookedSeat)=>{
                if(seat._id===bookedSeat._id){
                    return seat = {...seat,isBooked:true};
                };
            });
            return seat;
        });

        // reformat seats according to the required FE format 
        const seatsReformatted = {};
        updatedSeats.forEach((seat)=>{
            seatsReformatted[seat._id] = seat;
        });

         // reformat bookedSeats according to the required FE format 
        const bookedSeatsReformatted = {};
        bookedSeats.forEach((item)=>{
            bookedSeatsReformatted[item._id] = true;
        });

        if(!seats) {
            res.status(404).json({
                status: 404,
                message: "Not found"
            });
        } else {
            res.status(200).json({
                seats: seatsReformatted,
                bookedSeats: bookedSeatsReformatted,
                numOfRows: 8,
                seatsPerRow: 12,
            });
        };

    } catch (err) {
        console.log(err.stack);
    }; 
    client.close();
    console.log("disconnected!");
};

let lastBookingAttemptSucceeded = false;

const bookSeat = async(req,res)=>{
    const { seatId, creditCard, expiration, fullName, email } = req.body;
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("mongo_cont");
        
        // check if its already booked 
        const isAlreadyBooked = await db.collection("bookedSeats").findOne({_id: seatId});
        console.log("isAlreadyBooked:",isAlreadyBooked);
        if (isAlreadyBooked) {
            return res.status(400).json({
                message: "This seat has already been booked!",
            });
        }

        // check required fields exist
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

        // if all is well book the seat 
        lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;
        const result = await db.collection("bookedSeats").insertOne({
            _id: seatId,
            bookedBy: {
                fullName,
                email
            }
        });
        assert.equal(1, result.insertedCount);
        if(result.insertedCount===1) {
            res.status(200).json({ 
                status: 200, 
                success: true
            });
        } else {
            res.status(500).json({ 
                status: 500,  
                success: false 
            });
        };

    } catch (err) {
        console.log(err.stack);
    };

    client.close();
    console.log("disconnected!");
};

// 1. view the bookings. _that's already done (exercise 1)_
const getBookingBySeat = async(req,res)=>{
    const seatId = req.params.seatId; 
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("mongo_cont");
        const booking = await db.collection("bookedSeats").findOne({_id: seatId});

        if(!booking) {
            res.status(404).json({
                status: 404,
                message: "Booking not found"
            });
        } else {
            res.status(200).json({
                status:200,
                booking,
            });
        };

    } catch(err) {
        console.log(err.stack);
    };
    client.close();
    console.log("disconnected!");
};

// 2. delete a booking, i.e. make the seat available for purchase once more.
const deleteBooking = async(req,res)=>{
    const seatId = req.params.seatId; 
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("mongo_cont");
        const booking = await db.collection("bookedSeats").findOne({_id: seatId});

        if(!booking) {
            res.status(404).json({
                status: 404,
                message: "Booking not found"
            });

        } else {
            const result = await db.collection("bookedSeats").deleteOne(booking);
            assert.equal(1, result.deletedCount);

            if(result.deletedCount===1) {
                res.status(201).json({ 
                    status: 204, 
                    booking,
                    message: "Booking deleted successfully."
                });
            } else {
                res.status(500).json({ 
                    status: 500, 
                    message: err.message 
                });
            };

        };

    } catch(err) {
        console.log(err.stack);
    };
    client.close();
    console.log("disconnected!");
};

// 3. update the name or email of customer.
const updateBooking = async(req,res)=>{
    const seatId = req.params.seatId;
    const client = await MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        console.log("connected!");
        const db = client.db("mongo_cont");
        const booking = await db.collection("bookedSeats").findOne({_id: seatId});

        if(req.body.fullName){
            const fullName = {"bookedBy":{"fullName": req.body.fullName}};
            const newValues = {$set: {...fullName} }; 
            const result = await db.collection("greetings").updateOne({_id:seatId},newValues);
            res.status(200).json({ 
                status: 200, 
                booking, 
                message:"fullName updated"
            });
            assert.equal(1, result.matchedCount);
            assert.equal(1, result.modifiedCount);
        }; 

        if(req.body.email){}; 

        res.status(404).json({ 
            status: 404, 
            message: "Object body does not include the key that you are trying to modify."
        });

    } catch(err) {
        console.log(err.stack);
    };
    client.close();
    console.log("disconnected!");
};

module.exports = { getSeats, bookSeat, getBookingBySeat, deleteBooking, updateBooking };
