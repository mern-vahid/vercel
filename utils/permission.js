exports.isAdmin = (req, res, next) => {
    if ((req.user && req.user.is_admin) || (req.user && req.user.is_owner)) {
        return next()
    } else {
        return res.code(401, 'Unauthorized')
    }
}

exports.isLogin = (req, res, next) => {
    if (req.user) {
        return next()
    } else {
        return res.reflash('error', 'Login Your Account', '/login')
    }
}

exports.isOwner = (req, res, next) => {
    if (req.user.is_owner === true) {
        return next()
    } else {
        return res.code(401, 'Unauthorized')
    }
}
