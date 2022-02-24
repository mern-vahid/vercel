const { Router } = require('express')
const { isLogin } = require('../../utils/permission')

const {
    profile,
    _profile,
    delete_thumbnail,
} = require('../controllers/dashboard')

const router = Router()

router.get('/', isLogin, profile)
router.post('/', isLogin, _profile)

router.post('/delete/thumbnail', isLogin, delete_thumbnail)

module.exports = router
