const { Router } = require('express')

const router = Router()

router.use(require('./routes/index'))
router.use('/user', require('./routes/users'))
router.use('/category', require('./routes/category'))
router.use('/course', require('./routes/course'))
router.use('/lesson/category', require('./routes/lesson_category'))

module.exports = router
