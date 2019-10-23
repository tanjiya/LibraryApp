//Import The Mongoose Module
const mongoose = require('mongoose');
// Declare Mongoose Schema
const Schema   = mongoose.Schema;
// Include Moment Module
const moment = require('moment');

// Define BookInstance Schema
const BookInstanceSchema = new Schema({
    book: {
        type    : Schema.Types.ObjectId,
        ref     : 'Book',
        required: [true, 'Book is Required']
    },
    imprint: {
        type    : String,
        required: [true, 'Imprint is Required']
    },
    status: {
        type    : String,
        required: [true, 'Status is Requires'],
        enum    : ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default : 'Maintenance'
    },
    dueBack: {
        type   : Date,
        default: Date.now
    }
}, { collection: 'bookinstance' }, { timestamps: true });

// Virtual for BookInstance's URL
BookInstanceSchema
.virtual('url')
.get(() => {
    return '/catelog/bookinstance/' + this._id;
});

BookInstanceSchema
.virtual('dueBackFormatted')
.get(function () {
  return moment(this.dueBack).format('MMMM Do, YYYY');
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);
