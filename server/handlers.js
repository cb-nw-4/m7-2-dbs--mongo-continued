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
      // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db('ticket_booker');

        const seats = await db.collection("seats").find().toArray();
        if (seats.length === 0){
            res.status(404).json({ status: 404, message: "data not found"});
        }
        else {
            const newSeatsFormat = {};
            seats.forEach((seat)=>{
                newSeatsFormat[seat._id] = seat;
            });
            res.status(200).json({
                status: 200,
                seats: newSeatsFormat,      
                numOfRows: 8,
                seatsPerRow: 12,
              });    
        }
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });      
    }  
    client.close();     
};

const bookSeats = async (req, res) => {
    const { fullName, email, seatId, creditCard, expiration } = req.body;
    
    if (!creditCard || !expiration) {
        return res.status(400).json({
        status: 400,
        message: "Please provide credit card information!",
        });
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 400,
            message: "Please provide a valid email!",
        });
    }

    if (!fullName) {
        return res.status(400).json({
        status: 400,
        message: "Please provide your full name!",
        });
    }

    const client = await MongoClient(MONGO_URI, options);
    try { 
        await client.connect();
     
        const db = client.db('ticket_booker');

        const newValues = { $set: { isBooked: true, clientName: fullName, email: email} };
      
        const result = await db.collection("seats").updateOne({_id: seatId, isBooked: false }, newValues);   
        if (result.matchedCount === 0) {
            client.close();
            return res.status(400).json({
                message: "This seat has already been booked!",
                });
        }  
        assert.equal(1, result.matchedCount);
        assert.equal(1, result.modifiedCount); 

        const seat  = await db.collection("seats").find({_id: seatId }).toArray();        
        
        res.status(200).json({
            status: 200,
            success: true,
            seat: seat
          });   

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });      
    }  
    client.close();     
};

const deleteBooking = async (req, res) => {
const seatId = req.params.id;

const client = await MongoClient(MONGO_URI, options);
try { 
    await client.connect();
 
    const db = client.db('ticket_booker');

    const newValues = { $set: { isBooked: false }, $unset: { clientName: "", email: ""} };  
  
    const result = await db.collection("seats").updateOne({_id: seatId }, newValues);   
    if (result.matchedCount === 0) {
        client.close();
        return res.status(404).json({
            status: 404,
            message: "The seat is not found!",
            data: seatId
            });
    }  
    if (result.modifiedCount === 0) {
        client.close();
        return res.status(404).json({
            status: 404,
            message: "The seat is already available",
            data: seatId
            });
    }     
     
    res.status(200).json({
        status: 200,
        message: "the booking has been deleted",
       
      });   

} catch (err) {
    console.log(err.stack);
    res.status(500).json({ status: 500, message: err.message });      
}  
client.close();     
};

const modifyBooking = async (req, res) => {
    const seatId = req.params.id;
    const { fullName, email } = req.body;   
    

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 400,
            message: "Please provide a valid email!",
        });
    }

    if (!fullName) {
        return res.status(400).json({
        status: 400,
        message: "Please provide a full name!",
        });
    }
        
    const client = await MongoClient(MONGO_URI, options);
    try { 
        await client.connect();
     
        const db = client.db('ticket_booker');
    
        const newValues = { $set: { clientName: fullName, email: email } };  
            
        const result = await db.collection("seats").findOneAndUpdate({_id: seatId}, newValues, { returnOriginal: false });
        if(result)
            res.status(200).json({ status: 200, message: "succes" , data: result.value })
        else
            res.status(404).json({ status: 404, _id: seatId, data: req.body,  message: "Seat not Found" });
        
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ status: 500, message: err.message });      
    }  
    client.close();     
    };
module.exports = { getSeats, bookSeats, deleteBooking, modifyBooking };
