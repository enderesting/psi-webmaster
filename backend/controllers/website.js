const asyncHandler = require('express-async-handler');
const Website = require('../models/website');
const Page = require('../models/page');

exports.getWebsite = asyncHandler(async (req, res, next) => {
    const dbWebsite = await Website.findOne({ _id: req.params.id }).exec();
    const dbPages = await Page.find({ website: dbWebsite._id }).exec();

    const resPages = [];
    for (const dbPage of dbPages) {
        const resPage = {};
        resPage._id = resPage._id;
        resPage.websiteURL = dbWebsite.websiteURL;
        resPage.pageURL = dbPage.pageURL;
        if (dbPage.lastRated != null) resPage.lastRated = dbPage.lastRated;
        if (dbPage.rating != null) resPage.rating = dbPage.rating;

        resPages.push(resPage);
    } 

    const resWebsite = {};
    resWebsite._id = dbWebsite._id;
    resWebsite.websiteURL = dbWebsite.websiteURL;
    resWebsite.addedDate = dbWebsite.addedDate;
    if (dbWebsite.lastRated != null) resWebsite.lastDate = dbWebsite.lastRated;
    resWebsite.ratingStatus = dbWebsite.ratingStatus;
    resWebsite.moniteredPages = resPages;

    res.status(200).json(resWebsite);
})

exports.addPage = asyncHandler(async (req, res, next) => {
    const website = await Website.findById(req.params.id).exec();
    const page = new Page({
        website: website._id,
        pageURL: req.body.pageURL
    });

    await page.save();

    const resPage = {};
    resPage._id = page._id;
    resPage.websiteURL = page.websiteURL;
    resPage.pageURL = page.pageURL;

    res.status(201).json(resPage);
})

exports.deletePage = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    await Page.findByIdAndDelete(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Tutorial with id=${id}.`
          });
        } else {
          res.send({
            message: "Tutorial was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + id
        });
      });
})
