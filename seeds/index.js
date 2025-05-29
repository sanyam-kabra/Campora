const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

// connecting to mongoose
mongoose.connect('mongodb://localhost:27017/campora');
const db = mongoose.connection;
db.on('connected', () => {
  console.log('MongoDB connected successfully!');
});
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seed = async () => {
    for(let i=0;i<50;i++)
    {
        const loc = cities[Math.floor(Math.random()*1000)];
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${loc.city}, ${loc.state}`,
        })
        await camp.save();
        console.log(camp);
    }
}

seed();