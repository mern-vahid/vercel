const { Router } = require('express')
const {
    create,
    _create,
    index,
    status,
    _delete,
    edit,
    _edit,
} = require('../controllers/course')

const router = Router()

router.get('/create', create)
router.post('/create', _create)

router.get('/:id/edit', edit)
router.post('/:id/edit', _edit)

router.get('/', index)
router.get('/:id/status', status)
router.get('/:id/delete', _delete)

module.exports = router
