var passwordHash = require('password-hash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: String
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  }
});
var User = mongoose.model('User', userSchema);

exports.Model = User;

exports.all = function all(req, res) {
  User
    .find() 
    .then(function(result) {
      res.json({ items: result });
    }, function(err) {
      res.status(500).json({ 'message': err });
    });
}

exports.read = function read(req, res) {
  User
    .findById(req.params.id)
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.status(500).json({ 'message': err });
    });
}

exports.create = function create(req, res) {
  req.body.password = passwordHash.generate(req.body.password);
  User
    .create(req.body)
    .then(function(result) {
      res.json(result);
    }, function(err) {
      res.status(400).json(err);
    });
}

exports.update = function update(req, res) {
  User
    .update({ _id: req.params.id }, req.body)
    .then(function(result) {
      User
        .findById(req.params.id)
        .then(function(result) {
          res.json(result);
        }, function(err) {
          res.status(500).json({ message: err });
        });
    }, function(err) {
      res.status(500).json({ message: err });
    });
}

exports.destroy = function destroy(req, res) {
  User
    .findByIdAndRemove(req.params.id)
    .then(function(result) {
      res.json({});
    }, function(err) {
      res.status(500).json({ message: err });
    });
}

exports.authenticate = function authenticate(req, res) {
  User
    .findOne({ email: req.body.email })
    .then(function(result) {
      var user;
      var isVerified = passwordHash.verify(req.body.password, result.password);

      if (isVerified) {
        user = result;
        jwt.encode(process.env.JWT_SECRET, result, function (err, token) {
          user.token = token;
          if (err) 
            res.status(400).json(err);
          else
            res.json(user);
        });
      } else {
        res.status(403).send('Not Authorized');
      }
    }, function(err) {
      res.status(400).json(err);
    });
}
