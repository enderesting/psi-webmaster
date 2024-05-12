const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QWAssertionSchema = new Schema({
    module: {
        type: String,
        required: true,
        enum: ["act", "wcag"]
    },

    code: {
        type: String,
        required: true
    },

    outcome: {
        type: String,
        required: true,
        enum: ["passed", "warning", "failed", "inapplicable"]
    },

    level: {
        type: String
    },

    page: {
        type: Schema.ObjectId,
        ref: "Page",
        required: true
    }
});

module.exports = mongoose.model("QWAssertion", QWAssertionSchema)