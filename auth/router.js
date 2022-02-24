const { Router } = require('express')

const router = Router()

router.use(require('./routes/index'))
router.use('/dashboard', require('./routes/dashboard'))

module.exports = router
