var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blockSchema = new Schema({
  session: { type: Schema.ObjectId, ref: 'Session', required: true},
  status: { type: String, required: true, default: 'instruction', enum: ['instruction', 'active', 'closed']}
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  }
});
var Block = mongoose.model('Block', blockSchema);

exports.Model = Block;

exports.create = function(req, res) {
  Block
    .create(req.body)
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.status(400).json(err);
    });
};

exports.all = function(req, res) {
  var query = req.query.session ? req.query : {};
  Block
    .find(query)
    .populate('session')
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.status(400).json(err);
    });
};

exports.read = function(req, res) {
  Block
    .findById(req.params.id)
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.status(400).json(err);
    });
};

exports.update = function(req, res) {
  Block
    .findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.status(400).json(err);
    });
};
