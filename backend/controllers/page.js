const asyncHandler = require('express-async-handler');
const Page = require('../models/page');
const QWAssertion = require('../models/qwAssertion')
const qw = require('../qualweb');

exports.getPageEvaluation = asyncHandler(async (req, res, next) => {
    const page = await Page.findOne({ _id: req.params.id }).exec();
    res.status(200).json(page);
});