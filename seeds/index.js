const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities"); // contains 1000 US cities
const { descriptors, places } = require("./seedHelpers");

// connecting to mongo database
async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp--final");
}
main().catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;

    const camp = new Campground({
      location: location,
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: "https://source.unsplash.com/collection/483251",
      images: [
        {
          url: "https://res.cloudinary.com/dymodgmto/image/upload/v1649445606/YelpCamp--final/g9rqfypx5mw1zt0llsqv.jpg",
          filename: "YelpCamp--final/g9rqfypx5mw1zt0llsqv",
        },
        {
          url: "https://res.cloudinary.com/dymodgmto/image/upload/v1649445611/YelpCamp--final/rk5aiflpsqrv1i8w10bp.jpg",
          filename: "YelpCamp--final/rk5aiflpsqrv1i8w10bp",
        },
        {
          url: "https://res.cloudinary.com/dymodgmto/image/upload/v1649445614/YelpCamp--final/gc8dul069t8tcy0zu5va.jpg",
          filename: "YelpCamp--final/gc8dul069t8tcy0zu5va",
        },
        {
          url: "https://res.cloudinary.com/dymodgmto/image/upload/v1649445616/YelpCamp--final/befokie15w831erfd5fi.jpg",
          filename: "YelpCamp--final/befokie15w831erfd5fi",
        },
        {
          url: "https://res.cloudinary.com/dymodgmto/image/upload/v1649445625/YelpCamp--final/ywnqlkibshyn6hsmqwtt.jpg",
          filename: "YelpCamp--final/ywnqlkibshyn6hsmqwtt",
        },
        {
          url: "https://res.cloudinary.com/dymodgmto/image/upload/v1649445624/YelpCamp--final/m1utg5pen1ujelxdesva.jpg",
          filename: "YelpCamp--final/m1utg5pen1ujelxdesva",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price: price,
      author: "624f4bf2961b7c5c1a3a343c", // hard-coded author id of user: { "username" : "iftee", "email" : "iftee@email.com" } -- the creator of the project XD
    });
    await camp.save();
  }
};

seedDB()
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });

// image: "https://source.unsplash.com/collection/483251",
