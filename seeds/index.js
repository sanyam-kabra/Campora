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
        const price = Math.floor(Math.random()*20) + 10;
        const image = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/400`;;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${loc.city}, ${loc.state}`,
            price: price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, maiores! Officia sunt deserunt molestiae consequatur accusamus inventore, veritatis laudantium iusto expedita sint saepe, dolores error perspiciatis totam odio adipisci porro",
            image: image
        })
        await camp.save();
        console.log(camp);
    }
}

seed();