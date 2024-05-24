const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PageSchema = new Schema({
    website: {
        type: Schema.ObjectId,
        ref: "Website",
        required: true
    },

    pageURL: {
        type: String,
        required: true,
        maxLength: 10000
    },

    lastRated: {
        type: Date
    },

    rating: {
        type: String,
        enum: ["Compliant", "Non-compliant", "Error in rating"]
    },

    failedAnyAssertion: {
        type: Boolean
    },

    failedA: {
        type: Boolean
    },

    failedAA: {
        type: Boolean
    },

    failedAAA: {
        type: Boolean
    }
});

// Virtual for this author instance URL.
PageSchema.virtual("url").get(function () {
  return "/page/" + this._id;
});

// Export model.
module.exports = mongoose.model("Page", PageSchema);