var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
    seq: { type: Number, default: 0 }
});

var counter = mongoose.model('counter', CounterSchema);

// create a schema for our links
var urlSchema = new Schema({
  long_url: String,
  created_at: Date,
  user_details: Array,
});

urlSchema.pre('save', (next) => {
  var doc = this;
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, (error, counter) => {
      if (error)
          return next(error);
      doc.created_at = new Date();
      doc._id = counter.seq;
      next();
  });
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;