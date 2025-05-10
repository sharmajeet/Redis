const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [100, "Title cannot exceed 100 characters"],
    },
    author: {
        type: String,
        required: [true, "author name is required"],
        trim: true,
    },
    year: {
        type: Number,
        required: [true, 'publication year is required'],
        min: [1000, "Year must be at least 1000"],
        max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    image : {
        type: String,
        maxLength: [500, "Image URL cannot exceed 500 characters"],
        match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/, "Invalid image URL"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Book', BookSchema);