var router = require('express').Router();
const config = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", function(req, res) {
    config.database.selectByUser(req.body.username, (err, userRow) => {
      if (err) return res.status(500).send("Probleem op de server.");
      if (userRow)
        return res.status(409).send("Gebruikersnaam is al in gebruik.");
      config.database.insertUser(
        [
          req.body.username,
          bcrypt.hashSync(req.body.password, 8),
          0 // no admin
        ],
        function(err) {
          if (err)
            return res
              .status(500)
              .send("Er is iets mis gegaan tijdens de registratie.");
          config.database.selectByUser(req.body.username, (err, userRow) => {
            if (err)
              return res
                .status(500)
                .send("Er is iets mis gegaan tijdens de registratie");
            const token = jwt.sign(
              { id: userRow.id, isAdmin: userRow.admin },
              config.secret,
              {
                expiresIn: 86400 // expires in 24 hours
              }
            );
            //console.log(userRow)
            res.status(200).send({ auth: true, token: token, user: userRow });
          });
        }
      );
    });
  });
  
  router.post("/login", (req, res) => {
    config.database.selectByUser(req.body.username, (err, userRow) => {
      if (err) return res.status(500).send("Probleem op de server.");
      if (!userRow)
        return res
          .status(401)
          .send("Gebruikersnaam of wachtwoord zijn niet geldig.");
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        userRow.password
      );
      if (!passwordIsValid)
        return res
          .status(401)
          .send("Gebruikersnaam of wachtwoord zijn niet geldig.");
      const token = jwt.sign(
        { id: userRow.id, isAdmin: userRow.admin },
        config.secret,
        {
          expiresIn: 86400 // expires in 24 hours
        }
      );
      res.status(200).send({ auth: true, token: token, user: userRow });
    });
  });
  
module.exports = router;