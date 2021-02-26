# MongoDB - Day 2

Today you are going to take an app that "works" without a database, and integrate a database into it.

Remember the [Ticket Booker](https://github.com/cb-nw-4/-m6-1-react--reducers)? 😬

Currently, the backend is generating the seats for the theater. Let's migrate that to a database: MongoDB.

## Setup

`yarn install` to get all of the dependencies.

`yarn start` to start both the server and the FE app. _You **don't** need to run 2 terminals for this._

---

## Exercise 1 - Setup the database!

Get the seats into a database > collection. Each `seat` should be a document in the collection.

_You could use a util function like the one you created in the last workshop..._

Keep in mind, that under normal circumstances, the FE should not be affected by any changes you make here. Meaning it shouldn't break because you change the code in the backend. Be mindful of what the FE expects as data as well as how you are storing it in the database.

Don't forget to provide an `_id` to each document. You could do that before getting rid of the code that currently generates the seats. Each seat should look something like this.

```js
{
  _id: 'A-1',
  price: 225,
  isBooked: false
}
```

## Exercise 2 - Write that function!

Once you've migrated the data, it's time to get rid of the code that is generating the seats, and write a function that queries the database to retrieve all of the seats.

Inside of `handlers.js`, there is an empty function called `getSeats` that should replace the anonymous function that is called at the `/api/seat-availability` endpoint. _Don't forget to require it._

## Exercise 3 - Booking a seat

In `handlers.js`, write a function that will handle booking the seat. It needs to update the database.

While you're at it, remove the anonymous function that is called at `/api/book-seat` and create a proper function in the `handlers.js` file.

## Exercise 4 - Who booked that?

If you verify the data that is being sent to the server when a user buys a ticket, you will notice that there is some data that we are currently not handling: `fullName` and `email`.

What should we do with that?

There are two options that come to mind:

1. Create a new collection that contains all of the user documents, along with a reference to the seat they booked.
2. Add that data to the seat document directly.

Both are viable and it really depends on what will be done with the data. It's totally up to you!

---

<center>🟡 - Minimally complete workshop (75%) - 🟡</center>

---

## Exercise 5 - Uhoh! Incoming requirements

There is talk of creating an admin panel to manage the bookings. The FE is not built yet, but it would be good to enable the required functionality now in the BE.

Administrators would like to be able to

1. view the bookings. _that's already done (exercise 1)_
2. delete a booking, i.e. make the seat available for purchase once more.
3. update the name or email of customer.

You will need to test this implementation with Insomnia.

You could always try to improve the FE as well. There some benefit/difficulty in adding features to code you didn't write...

---

<center>🟢 - Complete workshop (100%) - 🟢</center>

---
