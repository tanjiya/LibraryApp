//Import The Mongoose Module
const mongoose = require('mongoose');
// Declare Mongoose Schema
const Schema   = mongoose.Schema;

// Define Genre Schema
const GenreSchema = new Schema({
    name: {
        type    : String,
        required: [true, 'Genre Name is Required'],
        max     : 100,
        min     : 3
    }
}, { collection: 'genre' }, { timestamps: true });

// Virtual for Genre's URL
GenreSchema
.virtual('url')
.get(() => {
    return '/catelog/genre/' + this._id;
});

module.exports = mongoose.model('Genre', GenreSchema);
