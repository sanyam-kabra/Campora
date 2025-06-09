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
  },
  {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489672/Campora/h4j55e2gnmwrlj7ocfqy.avif',
        filename: 'Campora/h4j55e2gnmwrlj7ocfqy',
        _id:'6847180b92e71dc388b60103'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489672/Campora/nrdpisbbiveanog5znzl.jpg',
        filename: 'Campora/nrdpisbbiveanog5znzl',
        _id: '6847180b92e71dc388b60104'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489671/Campora/jaatc3vxyggbg96akma6.jpg',
        filename: 'Campora/jaatc3vxyggbg96akma6',
        _id: '6847180b92e71dc388b60105'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489672/Campora/ucdbohspzvkq5wpmmjtl.jpg',
        filename: 'Campora/ucdbohspzvkq5wpmmjtl',
        _id: '6847180b92e71dc388b60106'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489671/Campora/okpymn9bnx0vigjda0ql.jpg',
        filename: 'Campora/okpymn9bnx0vigjda0ql',
        _id: '6847180b92e71dc388b60107'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489693/Campora/weasjf1aqgd6wnspplef.jpg',
        filename: 'Campora/weasjf1aqgd6wnspplef',
        _id: '6847181e92e71dc388b6012b'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489693/Campora/ug2cup2zamcnjcglgace.jpg',
        filename: 'Campora/ug2cup2zamcnjcglgace',
        _id: '6847181e92e71dc388b6012c'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489693/Campora/qz6svrtvwcnjl7d7i3uh.jpg',
        filename: 'Campora/qz6svrtvwcnjl7d7i3uh',
        _id: '6847181e92e71dc388b6012d'
      },
      {
        url: 'https://res.cloudinary.com/dza3arbk1/image/upload/v1749489694/Campora/i1mmysbtapjksdg9y6a4.jpg',
        filename: 'Campora/i1mmysbtapjksdg9y6a4',
        _id: '6847181e92e71dc388b6012e'
      }
];

const seed = async () => {
  await Campground.deleteMany({});
  const sample = array => array[Math.floor(Math.random()*array.length)];
    for(let i=0;i<300;i++)
    {
        const loc = cities[Math.floor(Math.random()*528)];
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