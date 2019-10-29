const mongoose = require('mongoose'), //Import The Mongoose Module
    Schema     = mongoose.Schema; // Declare Mongoose Schema

// Define Genre Schema
const GenreSchema = new Schema({
    name: {
        type     : String,
        required : [true, 'Genre Name is Required'],
        max      : 100,
        min      : 3,
        trim     : true,
        lowercase: true
    }
}, { collection : 'genre', timestamps: true });

// Virtual for Genre's URL
GenreSchema
    .virtual('url')
    .get(function() {
        return 'genre/' + this._id;
    });

module.exports = mongoose.model('Genre', GenreSchema);
