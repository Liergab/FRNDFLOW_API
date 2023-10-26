import postModel from '../model/post.model.js';
import asyncHandler from 'express-async-handler';
import userModel from '../model/user.model.js';

// @describe - post method
// @path - v1/api/post
// @access - private
export const createPost = async(req,res) => {

    const {decs} = req.body;

    const newPost = await postModel.create({
        decs,
        userId:req.user?._id,
        img: req.file?.originalname,
        path: req.file?.path
    })

    if(!newPost){
        res.status(400)
        throw new Error('Something error')
    }

    res.status(201).json(newPost)
    
}

// @describe - put method
// @path - v1/api/post/:id
// @access - private
export const updatePost = asyncHandler(async(req,res) => {
    const id = (req.params.id).trim()
    const post = await postModel.findById(id)
    if(post.userId === req.body.userId){
        const updatePost = await postModel.updateOne({$set:req.body})
        res.status(200).json(' post is succesfully Updated!')
    }
        res.status(400)
        throw new Error('You cant update others post')
    
})


// @describe - delete method
// @path - v1/api/post/:id
// @access - private
export const deletePost = asyncHandler(async(req,res) => {
    const id = (req.params.id).trim()

    const deletePost = await postModel.findByIdAndDelete(id)
    res.status(200).json(' post is succesfully Deleted!')
})


// @describe - put method
// @path - v1/api/post/:id/like
// @access - private
export const islikes = asyncHandler(async(req,res) => {

    // const id = (req.body.userId).trim()

    const post = await postModel.findById(req.params.id)

    if(!post){
        res.status(404)
        throw new Error('Post not get')
    }
    const userLikesPost = post.likes.includes(req.user.id);
    if (!userLikesPost) {
        await postModel.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { likes: req.user.id } }
        );
        res.status(200).json('Post has been liked!');
      } else {
        await postModel.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { likes: req.user.id } }
        );
        res.status(200).json('You dislike the post');
      }
})

// @describe - get method
// @path - v1/api/post/:id
// @access - public
export const getPostById = asyncHandler(async(req,res) => {

    const id = (req.params.id).trim()
    const post = await postModel.findById(id)
    res.status(200).json(post)
})


export const timeline = asyncHandler(async(req,res) => {
    const id = (req.params.id).trim()
 const currentId = await userModel.findById(id)
 const userPost = await postModel.find({userId:currentId._id})
 const friendPosts = await Promise.all(
    currentId.followings.map((friendId) => {
       return postModel.find({userId:friendId})
    })
 )
 res.status(200).json(userPost.concat(...friendPosts).sort(function(a, b){return b.createdAt - a.createdAt}))

})

export const profilePost = async(req, res) => {
    const user = await userModel.findOne({username:req.params.username});
    const post = await postModel.find({userId:user?._id})

    res.status(200).json(post.sort(function(a, b){return b.createdAt - a.createdAt}))

}