const express = require('express');
const router = express.Router();
const websitesController = require('../controllers/websites');
const websiteController = require('../controllers/website');


router.get("/websites", websitesController.getWebsites);
router.get("/website/:id", websiteController.getWebsite);
router.post("/websites", websitesController.addWebsite);
router.post("/website/:id", websiteController.addPage);

module.exports = router;
