module.exports = (req, res, next) => {
    //* Cusomeiz res.render
    res.page = (template, context) => {
        //* set csrf_token
        context.csrf_token = `<input type="hidden" name="_csrf" value="${req.csrfToken()}">`
        context.csrfToken = req.csrfToken()

        //* Thumbnail Url
        context.thumbnail =
            req.user && req.user.thumbnail.length > 0
                ? `/upload/thumbnail/${req.user.thumbnail}`
                : '/images/profile.jpg'

        //* add user info in page
        context.user = req.user
            ? {
                  thumbnail: req.user.thumbnail,
                  f_name: req.user.first_name,
                  l_name: req.user.last_name,
                  u_name: req.user.user_name,
                  email: req.user.email,
                  is_admin: req.user.is_admin,
                  is_owner: req.user.is_owner,
              }
            : { f_name: '', l_name: '', u_name: '', email: '', is_admin: '' }
        return res.render(template, context)
    }
    //* For Status Code
    res.code = (code = 404, title = 'Page Not Found', msg) => {
        return res.status(code).page('error/code', {
            layout: './layouts/auth',
            title,
            code,
        })
    }
    //* Flash And Redirect Page
    res.reflash = (key, message, path = 'back') => {
        req.flash(key, message)
        return res.redirect(path)
    }
    return next()
}
