import mongoose, { Schema, model } from "mongoose";

const postSchema = new Schema({
    // userId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     ref:"user"
    // },
    userId:{
        type:String,
        required:true
    },
    decs:{
        type:String,
    },
    img:{
        type:String,
        default:""
    },
    path:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    }
},{timestamps:true})

export default model('posts', postSchema)