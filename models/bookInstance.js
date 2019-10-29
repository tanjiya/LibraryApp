const mongoose = require('mongoose'), //Import The Mongoose Module
    Schema     = mongoose.Schema, // Declare Mongoose Schema
    moment     = require('moment'); // Include Moment Module

// Define BookInstance Schema
const BookInstanceSchema = new Schema({
    book: {
        type    : Schema.Types.ObjectId,
        ref     : 'Book',
        required: [true, 'Book is Required']
    },
    imprint: {
        type     : String,
        required : [true, 'Imprint is Required'],
        trim     : true,
        lowercase: true
    },
    status: {
        type    : String,
        required: [true, 'Status is Required'],
        enum    : ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default : 'Maintenance'
    },
    dueBack: {
        type   : Date,
        default: Date.now
    }
}, {  collection : 'bookinstance', timestamps: true });

// Virtual for BookInstance's URL
BookInstanceSchema
    .virtual('url')
    .get(function() {
        return this._id;
    });

// Virtual for BookInstance's dueBackFormatted
BookInstanceSchema
    .virtual('dueBackFormatted')
    .get(function () {
    return moment(this.dueBack).format('MMMM Do, YYYY');
    });

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
