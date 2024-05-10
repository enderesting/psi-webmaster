const {QualWeb} = require('@qualweb/core');
const fs = require('fs')

const clusterOptions = {
    maxConcurrency: 2,
    timeout: 60 * 1000,
    monitor: true
};

const qualWeb = new QualWeb({});
const pagesToRate = []
const millisecsToNextRatingBatch = 1000 * 60 * 0.5

exports.initQualWeb = async () => {
    await qualWeb.start(clusterOptions);
}

exports.evaluateURLs = async (pageURLs) => {
    await qualWeb.start(clusterOptions);
    reports = await qualWeb.evaluate({urls: pageURLs});
    await qualWeb.stop();

    urlAssertions = {}
    for (const url in reports) {
        urlAssertions[url] = this.parseEARLAssertions(reports[url].modules)
    }
    
    return urlAssertions;
}

exports.scheduledEvaluation = async () => {
    console.log("Evaluating current set of pages")
    setTimeout(this.scheduledEvaluation, millisecsToNextRatingBatch);
}

exports.addPageToBeRated = (pageId) => {
    pagesToRate.push(pageId)
}

exports.saveJSONFile = (objToSave, path) => {
    strToWrite = JSON.stringify(objToSave, null, 2)
    fs.writeFile(path, strToWrite, (err) => {
        if (err) {console.log("ERROR! Didn't save report!")}
    })
}

exports.parseEARLAssertions = (modules) => {
    actRules = modules["act-rules"]["assertions"]
    wcagRules = modules["wcag-techniques"]["assertions"]
    
    cleanedAssertions = [];
    for (const ruleName in actRules) {
        const rule = actRules[ruleName];

        const cleanedAssertion = {};
        cleanedAssertion.module = "act"
        cleanedAssertion.code = rule.code
        cleanedAssertion.outcome = rule.metadata.outcome;
        if (rule.metadata["success-criteria"].length > 0) {
            cleanedAssertion.level = rule.metadata["success-criteria"][0].level
        }

        cleanedAssertions.push(cleanedAssertion)
    }

    for (const ruleName in wcagRules) {
        const rule = wcagRules[ruleName];

        const cleanedAssertion = {};
        cleanedAssertion.module = "wcag"
        cleanedAssertion.code = rule.code
        cleanedAssertion.outcome = rule.metadata.outcome;
        if (rule.metadata["success-criteria"].length > 0) {
            cleanedAssertion.level = rule.metadata["success-criteria"][0].level
        }

        cleanedAssertions.push(cleanedAssertion)
    }

    return cleanedAssertions;
}