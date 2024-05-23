const {QualWeb} = require('@qualweb/core');
const fs = require('fs')

const plugins = {
    adBlock: false
}

const clusterOptions = {
    maxConcurrency: 2,
    timeout: 60 * 1000,
    monitor: true
};

const launchOptions = {
    args: ['--no-sandbox', '--ignore-certificate-errors'],
}

const qualWeb = new QualWeb(plugins);

exports.evaluateURLs = async (pageURLs) => {
    const evaluationOptions = {
        urls: pageURLs,
        execute: {
            act: true,
            wcag: true,
            bp: false
        }
    }

    await qualWeb.start(clusterOptions, launchOptions);
    reports = await qualWeb.evaluate(evaluationOptions);
    await qualWeb.stop();

    urlAssertions = {}
    for (const url of pageURLs) {
        if (reports[url] == null) {
            urlAssertions[url] = {
                rules: [],
                error: true
            }
        } else {
            urlAssertions[url] = this.parseURLEvalResults(reports[url].modules)
        }
    }

    return urlAssertions;
}

exports.parseURLEvalResults = (modules) => {
    if (modules["act-rules"] == null ||
        modules["wcag-techniques"] == null) {
            return { rules: [], error: true }
    }

    const actRules = modules["act-rules"]["assertions"]
    const wcagRules = modules["wcag-techniques"]["assertions"]

    const assertionsObject = {}
    assertionsObject.rules = parseEARLModule(actRules, "act").concat(
        parseEARLModule(wcagRules, "wcag"))
    assertionsObject.error = false;
    return assertionsObject;
}

parseEARLModule = (module, moduleName) => {
    parsed = [];
    for (const ruleName in module) {
        const rule = module[ruleName];
        const parsedRule = {
            module: moduleName,
            code: rule.code,
            outcome: rule.metadata.outcome,
            levels: []
        }

        if (rule.metadata["success-criteria"] != null) {
            for (const criteria of rule.metadata["success-criteria"]) {
                parsedRule.levels.push(criteria.level)
            }
        }
        
        parsed.push(parsedRule);
    }

    return parsed;
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

exports.saveJSONFile = (objToSave, path) => {
    strToWrite = JSON.stringify(objToSave, null, 2)
    fs.writeFile(path, strToWrite, (err) => {
        if (err) {console.log("ERROR! Didn't save report!")}
    })
}
