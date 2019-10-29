const mongoose = require('mongoose'), //Import The Mongoose Module
    Schema     = mongoose.Schema, // Declare Mongoose Schema
    moment     = require('moment'); // Include Moment Module

// Define Author Schema
const AuthorSchema = new Schema({
    firstName: {
        type     : String,
        required : [true, 'First Name is Required'],
        max      : 100,
        min      : 5,
        trim     : true,
        lowercase: true
    },
    lastName: {
        type     : String,
        required : [true, 'Last Name is Required'],
        max      : 100,
        min      : 5,
        trim     : true,
        lowercase: true
    },
    dateOfBirth: {
        type: Date,
    },
    dateOfDeath: {
        type   : Date,
    }
}, { collection : 'author', timestamps: true });

// Virtual for Author's Name
AuthorSchema
    .virtual('name')
    .get(function() {
        const name = this.firstName + ' ' + this.lastName;
        return name;
    });

// Virtual for Author's DateOfBirth
AuthorSchema
    .virtual('death')
    .get(function() {
        return moment(this.dateOfDeath).format('MMMM Do, YYYY');
    });

// Virtual for Author's DateOfDeath
AuthorSchema
    .virtual('birth')
    .get(function() {
        return moment(this.dateOfBirth).format('MMMM Do, YYYY');
    });

// Virtual for Author's LifeSpan
AuthorSchema
    .virtual('lifeSpan')
    .get(function() {
        const lifeSpan = (this.dateOfDeath.getFullYear() - this.dateOfBirth.getFullYear()).toString();
        
        return lifeSpan;
    });

// Virtual for Author's URL
AuthorSchema
    .virtual('url')
    .get(function() {
        return this._id;
    });

module.exports = mongoose.model('Author', AuthorSchema);
