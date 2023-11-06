var router = require('express').Router();
const config = require("../config");
const jwt = require("jsonwebtoken");

router.post("/", function(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, config.secret);
      if (decodedToken.isAdmin != 1) {
        return res
          .status(401)
          .send("You have to be an admin to perform this action.");
      }
      config.database.getTutorialsFromName([req.body.name], (err, tutorialRows) => {
        if (err) return res.status(500).send("Probleem op de server.");
        if (tutorialRows.length > 0) {
          return res.status(409).send("Tutorial naam bestaat al.");
        }
        const tutorial = [req.body.name, req.body.data];
        //console.log(tutorial)
        config.database.insertTutorial(tutorial, err => {
          console.log(err);
          if (err) return res.status(500).send("Probleem op de server.");
          //console.log(project);
          return res.status(200).send("Tutorial succesvol opgeslaan.");
        });
      });
    } catch (err) {
      return res.status(401).send(err);
    }
  });
  
  router.get("/", function(req, res) {
    config.database.getTutorials((err, tutorialRows) => {
      if (err) return res.status(500).send("Probleem op de server.");
      //if (!tutorialRows) return res.status(404).send('No project found.');
      return res.status(200).send({ tutorials: tutorialRows });
    });
  });
  
  router.put("/", function(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, config.secret);
      if (decodedToken.isAdmin != 1) {
        return res
          .status(401)
          .send("You have to be an admin to perform this action.");
      }
      config.database.getTutorialsFromName([req.body.name], (err, tutorialRows) => {
        if (err) return res.status(500).send("Probleem op de server.");
        if (tutorialRows.length < 1) {
          return res.status(409).send("Tutorial naam bestaat nog niet.");
        }
        const tutorial = [req.body.data, req.body.name];
        //console.log(tutorial)
        config.database.updateTutorial(tutorial, err => {
          console.log(err);
          if (err) return res.status(500).send("Probleem op de server.");
          //console.log(project);
          return res.status(200).send("Tutorial succesvol opgeslaan.");
        });
      });
    } catch (err) {
      return res.status(401).send(err);
    }
  });
  
  router.delete("/", function(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, config.secret);
      if (decodedToken.isAdmin != 1) {
        return res
          .status(401)
          .send("You have to be an admin to perform this action.");
      }
      config.database.deleteTutorial([req.body.name], err => {
        if (err) return res.status(500).send("Probleem op de server.");
        return res.status(200).send("Tutorial succesvol verwijderd.");
      });
    } catch (err) {
      return res.status(401).send(err);
    }
  });

module.exports = router;