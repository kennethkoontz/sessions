var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sessionSchema = new Schema({
  name: String
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  }
});
var Session = mongoose.model('Session', sessionSchema);

exports.Model = Session;

exports.create = function(req, res) {
  Session
    .create(req.body)
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.status(400).json(err);
    });
};

exports.all = function(req, res) {

};

exports.read = function(req, res) {

};
