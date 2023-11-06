var router = require('express').Router();
const config = require("../config");
const jwt = require("jsonwebtoken");

router.post("/", function(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, config.secret);
      config.database.getProjectsFromUserAndProjectname(
        [decodedToken.id, req.body.projectName],
        (err, projectRows) => {
          if (err) return res.status(500).send("Probleem op de server.");
          if (projectRows.length > 0) {
            return res.status(409).send("Projectnaam bestaat al.");
          }
          const project = [
            decodedToken.id,
            req.body.projectName,
            req.body.project
          ];
          config.database.insertProject(project, err => {
            if (err) return res.status(500).send("Probleem op de server.");
            //console.log(project);
            return res.status(200).send("Project succesvol opgeslaan.");
          });
        }
      );
    } catch (err) {
      return res.status(401).send(err);
    }
  });
  
  router.put("/", function(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, config.secret);
      config.database.getProjectsFromUserAndProjectname(
        [decodedToken.id, req.body.projectName],
        (err, projectRows) => {
          if (err) return res.status(500).send("Probleem op de server.");
          if (projectRows.length < 1) {
            return res.status(409).send("Projectnaam bestaat nog niet.");
          }
          const project = [
            req.body.project,
            decodedToken.id,
            req.body.projectName
          ];
          config.database.updateProject(project, err => {
            if (err) return res.status(500).send("Probleem op de server.");
            //console.log(project);
            return res.status(200).send("Project succesvol opgeslaan.");
          });
        }
      );
    } catch (err) {
      return res.status(401).send(err);
    }
  });
  
  router.get("/", function(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, config.secret);
      config.database.getProjectsFromUser([decodedToken.id], (err, projectRows) => {
        if (err) return res.status(500).send("Probleem op de server.");
        //console.log(projectRows);
        return res.status(200).send({ projects: projectRows });
      });
    } catch (err) {
      return res.status(401).send(err);
    }
  });
  
  router.delete("/", function(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization, config.secret);
      const userID = decodedToken.id;
      config.database.deleteProject([userID, req.body.projectname], err => {
        console.log(err);
        if (err) return res.status(500).send("Probleem op de server.");
        return res.status(200).send("Project succesvol verwijderd.");
      });
    } catch (err) {
      return res.status(401).send(err);
    }
  });

  module.exports = router;