const asyncHandler = require('express-async-handler');
const initDB = require('../initdb')

exports.initDB = asyncHandler(async (req, res, next) => {
    await initDB.main();
    res.status(200).json({message: "Database initialized!"});
})