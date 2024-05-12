const asyncHandler = require('express-async-handler');
const Website = require('../models/website');
const Page = require('../models/page');
const QWAssertion = require('../models/qwAssertion')
const qw = require('../qualweb');

exports.getWebsite = asyncHandler(async (req, res, next) => {
    const dbWebsite = await Website.findOne({ _id: req.params.id }).exec();
    const dbPages = await Page.find({ website: dbWebsite._id }).exec();

    const resPages = [];
    for (const dbPage of dbPages) {
        const resPage = {};
        resPage._id = dbPage._id;
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

exports.deleteWebsite = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    await Website.findByIdAndDelete(id)
        .then(data => {
            if (!data)
                res.status(404).json( {message: `Cannot delete Website with id=${id}.`});
            else
                res.json( {message: "Website was deleted successfully!"});
        })
        .catch(err => {
            res.status(500).json({
                message: "Could not delete Website with id=" + id
            });
        });
});

exports.deletePages = asyncHandler(async (req, res, next) => {
    const pagesToDelete = req.query.urls.split(',');
    const website = await Website.findOne({ _id: req.params.id }).exec();
    const monitoredPages = await Page.find({ website: website._id }).exec();
    const deletedPages = [];

    for(const i in monitoredPages) {
        const page = monitoredPages[i];
        if(pagesToDelete.includes(page.pageURL)){
            const id = page._id;
            await Page.findByIdAndDelete(id)
                .then(data => {
                    if (!data)
                        res.status(404).json( {message: `Could not delete Page with id=${id}.`});
                    else
                        deletedPages.push(page);
                })
                .catch(err => {
                    res.status(500).json({
                        message: `Could not delete Page with id=${id}.`
                    });
                });
        }
    }
    res.status(200).json(deletedPages);
})

exports.requestRating = asyncHandler(async (req, res, next) => {
    const dbWebsite = await Website.findOne({ _id: req.params.id }).exec();
    const websiteURL = dbWebsite.websiteURL;

    // Change website status
    dbWebsite.ratingStatus = "Being rated";
    await dbWebsite.save();

    res.status(201).json({ message: "Rating..." });

    // Generate accessability reports
    const urlAssertions = await qw.evaluateURLs(req.body.urls)
    const timestamp = Date.now();
    console.log("Assertion starts");

    for (const fullUrl in urlAssertions) {
        console.log("Assertion for: " + fullUrl);
        await handlePageAssertions(fullUrl, websiteURL, urlAssertions, 
            timestamp);
    }

    // Update associated website's mongo document
    console.log("Update website status");
    let totalRated = 0;
    let totalOfFailed = 0;
    let totalOfAFailed = 0;
    let totalOfAAFailed = 0;
    let totalOfAAAFailed = 0;
    let allWebsitePagesAssertions = [];

    dbPagesFromWebsite = await Page.find({ website: dbWebsite._id }).exec();
    for (const page of dbPagesFromWebsite) {
        if (page.lastRated) {
            totalRated++;
            if (page.failedAnyAssertion) totalOfFailed++;
            if (page.failedA) totalOfAFailed++;
            if (page.failedAA) totalOfAAFailed++;
            if (page.failedAAA) totalOfAAAFailed++;
        }

        const pageAssertions = await QWAssertion.find({ page: page._id }).exec();
        allWebsitePagesAssertions = allWebsitePagesAssertions
            .concat(pageAssertions);
    }
    const common10Errors = qw.commonNErrors(10, allWebsitePagesAssertions);
    
    dbWebsite.ratedTotal = totalRated;
    dbWebsite.failedAssertionsTotal = totalOfFailed;
    dbWebsite.failedATotal = totalOfAFailed;
    dbWebsite.failedAATotal = totalOfAAFailed;
    dbWebsite.failedAAATotal = totalOfAAAFailed;
    dbWebsite.commonErrors = common10Errors;
    dbWebsite.lastRated = timestamp;
    dbWebsite.ratingStatus = "Rated";
    console.log("Save Website Status");

    await dbWebsite.save();
})

async function handlePageAssertions(fullUrl, websiteURL, urlAssertions,
        timestamp) {
    // const pageUrl = fullUrl.replace(websiteURL + "/", "");
    // console.log(pageUrl);
    const dbPage = await Page.findOne({ pageURL: fullUrl }).exec(); // struggling to find anything here
    // Delete previous assertions for this page
    await QWAssertion.deleteMany({ page: dbPage._id }).exec();

    let anyFailed = false;
    let anyAFailed = false;
    let anyAAFailed = false;
    let anyAAAFailed = false;

    // Add the new assertions
    const assertions = urlAssertions[fullUrl];
    for (const assertion of assertions) {
        const qwAssertion = QWAssertion({
            module: assertion.module,
            code: assertion.code,
            outcome: assertion.outcome,
            page: dbPage._id
        });
        if (assertion.level) { qwAssertion.level = assertion.level; }

        await qwAssertion.save();

        if (assertion.outcome == "failed") {
            anyFailed = true;
            if (assertion.level == "A") { anyAFailed = true; }
            if (assertion.level == "AA") { anyAAFailed = true; }
            if (assertion.level == "AAA") { anyAAAFailed = true; }
        }
    }

    // Update the associated page
    dbPage.failedAnyAssertion = anyFailed;
    dbPage.failedA = anyAFailed;
    dbPage.failedAA = anyAAFailed;
    dbPage.failedAAA = anyAAAFailed;
    dbPage.lastRated = timestamp;
    await dbPage.save();
}

