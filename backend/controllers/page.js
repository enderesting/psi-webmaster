const asyncHandler = require('express-async-handler');
const Page = require('../models/page');
const QWAssertion = require('../models/qwAssertion')
const qw = require('../qualweb');

exports.getPageEvaluation = asyncHandler(async (req, res, next) => {
    res.status(501);
});