const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const imageSchema = new Schema({
    url: String,
    filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
    {
        title: String,
        location: String,
        description: String,
        price: Number,
        images: [imageSchema],
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    opts
);

// the following code block is required for the popup on the map
campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.location}</p>
    `;
});

// the following code is required to delete all the reviews associated with a campground when that campground is deleted
campgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

const Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;

// <p>${this.description.substring(0, 20)}...</p>
