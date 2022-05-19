const User = require('../../models').User;

module.exports = {

    add(req, res) {
        return User
          .create({
            name: req.body.name,
            email: req.body.email,
            passowrd: req.body.passowrd,
            dob: req.body.dob
          })
          .then((user) => res.status(201).send(user))
          .catch((error) => res.status(400).send(error));
      },
};