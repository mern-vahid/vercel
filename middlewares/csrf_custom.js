module.exports = (err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)

    // handle CSRF token errors here
    return res.status(403).render('error/code', {
        layout: './layouts/auth',
        title: 'CSRF TOKEN INVALID',
        code: 403,
    })
}
