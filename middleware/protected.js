import User from "../model/user.model.js";
import asyncHandler from 'express-async-handler';
import  jwt from 'jsonwebtoken';

const protect = asyncHandler(async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            req.user = await User.findById(decoded.id)

            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error("Not Authorize");
        }
    }else{
        res.status(401)
        throw new Error("Not Authorize no Token");
    }
})

export default protect