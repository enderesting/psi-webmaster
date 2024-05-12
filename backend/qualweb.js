const {QualWeb} = require('@qualweb/core');
const fs = require('fs')

const clusterOptions = {
    maxConcurrency: 2,
    timeout: 60 * 1000,
    monitor: true
};

const qualWeb = new QualWeb({});

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

exports.commonNErrors = (n, assertions) => {
    let errorTypeTotal = 0;
    const counts = {};
    for (const assertion of assertions) {
        const code = assertion.code;
        if (!counts[code]) {
            counts[code] = 1;
            errorTypeTotal++;
        } else {
            counts[code] = counts[code] + 1;
        }
    }

    const countsEntries = Object.entries(counts);
    const sortedCountsEntries = countsEntries.sort((entry1, entry2) => {
        return entry2[1] - entry1[1];
    })

    const properN = errorTypeTotal > n ? n : errorTypeTotal;
    const commonEntries = sortedCountsEntries.slice(0, properN);

    const commonErrors = []
    for (const [error, count] of commonEntries) {commonErrors.push(error);}

    return commonErrors;
}