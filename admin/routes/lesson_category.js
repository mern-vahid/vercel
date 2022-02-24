const { Router } = require('express')
const {
    create,
    _create,
    index,
    _delete,
    status,
} = require('../controllers/lesson_category')

const router = Router()

router.get('/create', create)
router.post('/create', _create)

router.get('/', index)
router.get('/:id/delete', _delete)
router.get('/:id/status', status)

module.exports = router
