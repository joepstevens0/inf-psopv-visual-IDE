var router = require('express').Router();
const config = require("../../config");

router.post("/", function(req, res) {
    // add reset for every 999,999 projects
    const project = [req.body.project];
    config.database.insertSharedProject(project, (err, projectID) => {
      if (err) return res.status(500).send("Probleem op de server.");
      return res.status(200).send({ code: projectID });
    });
  });
  
  router.get("/", function(req, res) {
    config.database.getSharedProjectFromID([req.query.projectID], (err, projectRow) => {
      if (err) return res.status(500).send("Probleem op de server.");
      if (!projectRow) return res.status(404).send("Geen project gevonden.");
      //console.log(projectRow);
      return res.status(200).send({ project: projectRow.project });
    });
  });

  module.exports = router;