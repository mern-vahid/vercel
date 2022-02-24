const { Router } = require('express')

const router = Router()

router.use(require('./routes/index'))

module.exports = router
