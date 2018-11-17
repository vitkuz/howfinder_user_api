async function error500(err, req, res, next) {
    res.status(500).json({
        error: '500 Error error'
    });
}

module.exports = error500;