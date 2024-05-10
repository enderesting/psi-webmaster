const {QualWeb} = require('@qualweb/core');
const Page = require('./models/page');
const fs = require('fs')

const clusterOptions = {
    maxConcurrency: 5,
    timeout: 60 * 1000,
    monitor: true
};

const qualWeb = new QualWeb({});
const pagesToRate = []
const millisecsToNextRatingBatch = 1000 * 60 * 0.5

exports.initQualWeb = async () => {
    await qualWeb.start(clusterOptions);
}

exports.evaluateURL = async (pageURL) => {
    await qualWeb.start(clusterOptions);
    report = await qualWeb.evaluate({url: pageURL});
    await qualWeb.stop();

    const modules = report[pageURL].modules;
    this.parseEARLAssertions(modules)
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