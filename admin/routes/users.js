const { Router } = require('express')
const { users, admin, status } = require('../controllers/users')

const router = Router()

router.get('/users', users)
router.get('/admin', admin)

router.get('/:id/:status', status)

module.exports = router
