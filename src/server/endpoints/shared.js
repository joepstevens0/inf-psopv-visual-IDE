var router = require('express').Router();

router.use('/project', require('./shared/project.js'));

module.exports = router;