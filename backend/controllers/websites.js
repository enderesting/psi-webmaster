const asyncHandler = require('express-async-handler');
const Website = require('../models/website');

exports.getWebsites = asyncHandler(async (req, res, next) => {
    const dbWebsites = await Website.find({}).exec();

    const resWebsites = [];
    for (const dbWebsite of dbWebsites) {
        const resWebsite = {};
        resWebsite.websiteURL = dbWebsite.websiteURL;
        resWebsite.addedDate = dbWebsite.addedDate;
        if (dbWebsite.lastRated != null) {
            resWebsite.lastDate = dbWebsite.lastRated;
        }
        resWebsite.ratingStatus = dbWebsite.ratingStatus;
        
        resWebsites.push(resWebsite);
    }

    res.json(resWebsites);
})

exports.addWebsite = asyncHandler(async (req, res, next) => {
    res.json({message: "Not implemented"});
})

