const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment:{
        type:String,
        maxLength:[500, "Characters Limit Reached!"]
    },
    rating:{
        type:Number,
        required:true,
        max:[5, "Can rate max 10 points."],
        min:[0, "Can rate min 0 points."]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review=new mongoose.model("Review", reviewSchema);

module.exports = Review;