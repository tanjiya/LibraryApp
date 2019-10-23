//Import The Mongoose Module
const mongoose = require('mongoose');
// Declare Mongoose Schema
const Schema   = mongoose.Schema;

// Define Author Schema
const AuthorSchema = new Schema({
    firstName: {
        type    : String,
        required: [true, 'First Name is Required'],
        max     : 100,
        min     : 5
    },
    lastName: {
        type    : String,
        required: [true, 'Last Name is Required'],
        max     : 100,
        min     : 5
    },
    dateOfBirth: {
        type: Date
    },
    dateOfDeath: {
        type: Date,
    }
}, { collection: 'author' }, { timestamps: true });

// Virtual for Author's LifeSpan
AuthorSchema
.virtual('lifespan')
.get(() => {
    return (this.dateOfDeath.getYear() - this.dateOfBirth.getYear().toString());
});

// Virtual for Author's URL
AuthorSchema
.virtual('url')
.get(() => {
    return '/catelog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
