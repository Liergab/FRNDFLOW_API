import User from '../model/user.model.js';
import asyncHandler from 'express-async-handler';
import generateToken from "../middleware/generateToken.js";
import bcrypt from 'bcrypt'
import userModel from '../model/user.model.js';
import mongoose from 'mongoose';

// @describe
// @path
// @access

export const getUser = asyncHandler(async(req,res) => {
    res.json(req.user)
})

// @describe - register user
// @path - v1/api/register
// @access - public

export const register = asyncHandler(async(req,res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400)
        throw new Error('All fields required!')
    }
    const verify = await User.findOne({email})

    if(verify){
        res.status(400)
        throw new Error('Email is already used!')
    }

    const usernameVerify = await User.findOne({username})
    if(usernameVerify){
        res.status(400)
        throw new Error('Username is already used!')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({
        username,
        email,
        password:hashedPassword
    })
    res.status(201).json(newUser)
})

// @describe - login user
// @path - v1/api/login
// @access - public

export const login = asyncHandler(async(req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            username: user.username,
            generateToken:generateToken(user.id)
        })
    }else{
        res.status(404)
        throw new Error('Invalid Credentials!')
    }
})

// @describe - Update user
// @path - v1/api/users/:id
// @access - private

export const updateUser = asyncHandler(async(req,res) => {
    const id = (req.params.id).trim()
    
    if(req.body.userId === id || req.body.isAdmin){
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
        const update = await User.findByIdAndUpdate(id,{$set:req.body})
    
        res.status(200).json(update)
    }else{
        res.status(500)
        throw new Error('you can update only your account!')
    }
   
})

// @describe - Delete user
// @path - v1/api/users/:id
// @access - private

export const deleteUser = asyncHandler(async(req,res) => {
    const id = (req.params.id).trim()
    
    if(req.body.userId === id || req.body.isAdmin){
        const deleteUser = await User.findByIdAndDelete(id)
    
        res.status(200).json({message:'successfully Deleted'})
    }else{
        res.status(500)
        throw new Error('you can delete only your account!')
    }  
})

// @describe - get user by id
// @path - v1/api/users/:id
// @access - private

export const getUserById = asyncHandler(async(req,res) => {
    // const id = (req.params.id).trim()
    const id = req.query.id
    const username = req.query.username
    
    const user = id ? await User.findById(id) : await User.findOne({username:username})
    const {password, updatedAt, ...others} = user._doc
    res.status(200).json(others) 
});

// @describe - put follow
// @path - v1/api/users/:id
// @access - private

export const follow =  asyncHandler(async (req, res) => {
    
      const id = (req.params.id).trim()
      // const {userId} = req.body;
      if (req.body.userId !== id) {
        const user = await User.findById(id)
        const currentUser = await User.findById(req.body.userId)
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } })
          await currentUser.updateOne({ $push: { followings:id} })
          res.status(200).json({ message: 'User have been followed' })
        } else {
          res.status(403).json({ message: 'Already following' })
        }
      } else {
        res.status(403).json({ message: 'You cannot follow yourself' })
      }
  })

  // @describe - put unfollow
// @path - v1/api/users/:id
// @access - private

export const unFollow =  asyncHandler(async (req, res) => {
    
    const id = (req.params.id).trim()
    if (req.body.userId !== id) {
      const user = await User.findById(id)
      const currentUser = await User.findById(req.body.userId)
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { followings:id} })
        res.status(200).json({ message: 'User have been unfollowed' })
      } else {
        res.status(403).json({ message: 'Already unfollowing' })
      }
    } else {
      res.status(403).json({ message: 'You cannot follow yourself' })
    }
})


  // @describe - get followers
// @path - v1/api/user/follower
// @access - private
export const getFollowers = async(req, res) => {
    try {
        const userId = (req.params.userId)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }
        const user = await userModel.findById(userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return userModel.findById(friendId)
            })
        )

        let friendist = []
        friends.map((friend) => {
            const {_id, username, profilePicture} = friend;
            friendist.push({_id, username, profilePicture})
        })
        res.status(200).json(friendist)

    } catch (error){
        console.log(error)
    }
}

// @describe - get followers
// @path - v1/api/user/follower
// @access - private

export const getAllUser = async(req,res) => {
    const user = await userModel.find()

    let users = []
    user.map((u) => {
        const{_id, username, profilePicture} = u
        users.push({_id,username,profilePicture})
    })

    res.status(200).json(users)
}


  




