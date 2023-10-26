import express from 'express';
import * as controller from '../controller/user.controller.js'
import protect from '../middleware/protected.js';
const router = express.Router()

// register
router.post('/register',controller.register)
// login
router.post('/login', controller.login)
// update
router.put('/users/:id',controller.updateUser)
// delete
router.delete('/users/:id',protect, controller.deleteUser)
// getuser
router.get('/users/',protect,  controller.getUserById)
// follow a user
router.put('/users/:id/follow', controller.follow)

// unfollow a user
router.put('/users/:id/unfollow',  controller.unFollow)

// from req.user
router.get('/getuser',protect, controller.getUser)

// get followers

router.get('/users/following/:userId', controller.getFollowers)

// get all user
router.get('/users/all',protect,controller.getAllUser)

export default router