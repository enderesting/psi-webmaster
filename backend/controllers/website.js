const asyncHandler = require('express-async-handler');
const Website = require('../models/website');
const Page = require('../models/page');

exports.getWebsite = asyncHandler(async (req, res, next) => {
    const dbWebsite = await Website.findOne({ _id: req.params.id }).exec();
    const dbPages = await Page.find({ website: dbWebsite._id }).exec();

    const resPages = [];
    for (const dbPage of dbPages) {
        const resPage = {};
        resPage.websiteURL = dbWebsite.websiteURL;
        resPage.pageURL = dbPage.pageURL;
        if (dbPage.lastRated != null) resPage.lastRated = dbPage.lastRated;
        if (dbPage.rating != null) resPage.rating = dbPage.rating;

        resPages.push(resPage);
    } 

    const resWebsite = {};
    resWebsite.websiteURL = dbWebsite.websiteURL;
    resWebsite.addedDate = dbWebsite.addedDate;
    if (dbWebsite.lastRated != null) {
        resWebsite.lastDate = dbWebsite.lastRated;
    }
    resWebsite.ratingStatus = dbWebsite.ratingStatus;
    resWebsite.moniteredPages = resPages;

    res.json(resWebsite);
})

exports.addPage = asyncHandler(async (req, res, next) => {
    res.json({message: "Not implemented"});
})

