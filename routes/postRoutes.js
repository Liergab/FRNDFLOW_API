import express from 'express';
import * as controller from '../controller/post.controller.js';
import protect from '../middleware/protected.js';
import multer from 'multer'
const router = express.Router();




  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
  });
  
    const upload = multer({
    storage:storage
  });

// create post
router.post('/posts',upload.single('image'),protect,controller.createPost)
// update post
router.put('/post/:id',controller.updatePost)
// delete post
router.delete('/post/:id', controller.deletePost)
// like post
router.put('/post/:id/like',protect,controller.islikes)
// get post
router.get('/post/:id',controller.getPostById)
// get timeline

router.get('/timeline/:id', controller.timeline)

router.get('/post/profile/:username', controller.profilePost)
export default router