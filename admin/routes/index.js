const { Router } = require('express')
const { isAdmin } = require('../../utils/permission')
const { index } = require('../controllers/index')

const router = Router()

router.get('/', isAdmin, index)

module.exports = router
