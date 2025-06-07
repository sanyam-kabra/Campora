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

const images = [
  {
    url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749269931/Campora/ulvwjis3kocoy0mn6b8x.jpg',
    filename: 'Campora/ulvwjis3kocoy0mn6b8x',
    _id: '6843bdab03d88de4f7a3c963'
  },
  {
    url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749269930/Campora/nvnwuysvn0mfzdt4tjat.jpg',
    filename: 'Campora/nvnwuysvn0mfzdt4tjat',
    _id: '6843bdab03d88de4f7a3c964'
  },
  {
    url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749269930/Campora/apextcldnkwst2vaxwpm.jpg',
    filename: 'Campora/apextcldnkwst2vaxwpm',
    _id: '6843bdab03d88de4f7a3c965'
  },
  {
    url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749269930/Campora/wvpo9nzce6bowhutuykp.jpg',
    filename: 'Campora/wvpo9nzce6bowhutuykp',
    _id: '6843bdab03d88de4f7a3c966'
  }
];

const seed = async () => {
  await Campground.deleteMany({});
  const sample = array => array[Math.floor(Math.random()*array.length)];
    for(let i=0;i<300;i++)
    {
        const loc = cities[Math.floor(Math.random()*1000)];
        const price = Math.floor(Math.random()*20) + 10;
        // Shuffle and select 2
        const randomImages = images.sort(() => 0.5 - Math.random()).slice(0, 2);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${loc.city}, ${loc.state}`,
            price: price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, maiores! Officia sunt deserunt molestiae consequatur accusamus inventore, veritatis laudantium iusto expedita sint saepe, dolores error perspiciatis totam odio adipisci porro",
            author: '6841b2a18e82c178fee0a1f7',
            geometry: {
              type: 'Point',
              coordinates: [
                loc.longitude,
                loc.latitude,
              ]
            },
            images: randomImages
        })
        await camp.save();
        console.log(camp);
    }
}

seed();