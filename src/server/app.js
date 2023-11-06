"use strict";
const express = require("express");
//const DB = require("./db");
const config = require("./config");
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cron = require("node-cron");
//const db = new DB("../sql/sqlite.db");
const app = express();
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CORS middleware
const enableCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};
app.use(enableCrossDomain);

cron.schedule("0 0 * * *", function() {
  // delete all shared pojects at 00:00
  console.log("deleting all shared projects");
  config.database.deleteSharedProjects(err => {
    if (err) console.log(err);
    if (!err) {
      config.database.resetSequence(err => {
        if (err) console.log(err);
      });
    }
  });
});

//router.post('/test', function (req, res) {
//return res.status(404).send("failure")
/*config.database.getProjectsFromUser([1, "projectname"], (err, projectRows) => {
        if (err) return res.status(500).send('Error on the server.');
        console.log(projectRows);
        if (projectRows) {
            return res.status(409).send("Project name already exists.");
        }
        const project = [
            1,
            "projectname",
            '{"projectname":"unnamed","blocks":[],"projectvars":[]}',
        ];
        config.database.insertProject(project, (err) => {
            if (err) return res.status(500).send('Error on the server.');
            console.log(project);
            return res.status(200).send("Project successfully saved.");
        });
    });*/
/*config.database.test((err, projectRows) => {
        console.log(err);
        if (err) return res.status(500).send('Error on the server.');
        console.log(projectRows);
        return res.status(200).send("Project successfully saved.");
    });*/
/*config.database.makeAdmin((err) => {
        console.log(err);
        if (err) return res.status(500).send('Error on the server.');
        return res.status(200).send("Project successfully saved.");
    });*/
/*config.database.updatePassword((err) => {
      console.log(err);
      if (err) return res.status(500).send('Error on the server.');
      return res.status(200).send("Project successfully saved.");
  });*/
  /*config.database.changeName((err) => {
    console.log(err);
    if (err) return res.status(500).send('Error on the server.');
    return res.status(200).send("Project successfully saved.");
});*/
/*const tutorial = [
        req.body.name,
        req.body.data,
    ];
    console.log(tutorial)
    config.database.insertTutorial(tutorial, (err) => {
        console.log(err)
        if (err) return res.status(500).send('Error on the server.');
        //console.log(project);
        return res.status(200).send("Tutorial successfully saved.");
    });*/
/*const project = [
        1,
        "projectname",
        '{"projectname":"unnamed","blocks":[],"projectvars":[]}',
    ];
    config.database.insertProject(project, (err) => {
        console.log(err);
        if (err) return res.status(500).send('Error on the server.');
        console.log(project);
        return res.status(200).send("Project successfully saved.");
    });*/

//});

router.use('/', require('./endpoints/user'));

router.use('/project', require('./endpoints/project'));

router.use('/shared', require('./endpoints/shared'));

router.use('/tutorial', require('./endpoints/tutorial'));

app.use(router);
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
  console.log("Server listening on port " + port);
  console.log("deleting projects >1 day old");
  config.database.deleteOldSharedProjects(err => {
    if (err) console.log(err);
  });
});
