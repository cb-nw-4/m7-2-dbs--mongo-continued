// var fs= require('file-system');

const createSeats = () =>{
    const seats = [];
    const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
    
    seats.push({
        _id: `${row[r]}-${s}`,
        price: 225,
        isBooked: false,
    }
    )
    }}
    return seats
}





const fs = require('fs');
const data = createSeats();
const jsonString =  JSON.stringify(data);
fs.writeFile('./data.json', jsonString, err => {
if (err) {
    console.log('Error writing file', err)
} else {
    console.log('Successfully wrote file')
}
});