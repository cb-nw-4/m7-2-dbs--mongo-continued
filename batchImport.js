var fs= require('file-system');

const { MongoClient } = require('mongodb');

require('dotenv').config();

const {MONGO_URI} = process.env;

const options = {
    userNewURLParser: true,
    userUnifiedTopology: true,
}


const assert = require('assert');




const batchImport = async(req, res) =>{


    const client = await MongoClient(MONGO_URI, options);
    const seats = JSON.parse(fs.readFileSync("./data/data.json"));
    
    try{

        await client.connect();
    
        const db = client.db('exercise_2');
        const data =  await db.collection("reservations").insertMany(seats);
        assert.strictEqual(seats.length, data.insertedCount)

        console.log(data, data)


    }catch(error){
        console.log(error.stack)

    }

    client.close();
    console.log("Disconnected!!")
    
}

batchImport()


    