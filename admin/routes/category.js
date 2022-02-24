const { Router } = require('express')
const {
    create,
    _create,
    index,
    status,
    _delete,
    edit,
    _edit,
} = require('../controllers/category')
const { isOwner, isAdmin } = require('../../utils/permission')

const router = Router()

router.use(isAdmin)
router.get('/', index)
router.get('/create', create)
router.post('/create', _create)

router.use(isOwner)
router.get('/:id/status', status)
router.get('/:id/delete', _delete)
router.get('/:id/edit', edit)
router.post('/:id/edit', _edit)

module.exports = router
