const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WebsiteSchema = new Schema({
    websiteURL: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 1000
    },

    addedDate: {
        type: Date,
        required: true,
        default: Date.now()
    },

    lastRated: {
        type: Date
    },

    ratingStatus: {
        type: String,
        enum: ["To be rated", "Being rated", "Rated", "Error"],
        required: true,
        default: "To be rated"
    }
});

// Virtual for this author instance URL.
WebsiteSchema.virtual("url").get(function () {
  return "/page/" + this._id;
});

// Export model.
module.exports = mongoose.model("Website", WebsiteSchema);