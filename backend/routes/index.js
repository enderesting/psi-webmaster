const express = require('express');
const router = express.Router();
const websitesController = require('../controllers/websites');
const websiteController = require('../controllers/website');
const initDBController = require('../controllers/init');


router.get("/websites", websitesController.getWebsites);
router.get("/website/:id", websiteController.getWebsite);

router.post("/websites", websitesController.addWebsite);
router.post("/website/:id", websiteController.addPage);
router.post("/website/:id/evaluate", websiteController.requestRating);

router.delete("/page/:id", websiteController.deletePage);

router.get("/init", initDBController.initDB);

module.exports = router;
