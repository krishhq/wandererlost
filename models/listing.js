const mongoose=require("mongoose");
const Review=require("./reviews");
const Schema=mongoose.Schema;

const listingSchema =new Schema({
    title:{
        type:String,
        required:true,
        maxLength:[100, "Title too long"],
        minLength:[5, "Title too short"],
    },
    description:{
        type:String,
        maxLength:[500, "Description too long"],
        minLength:[10, "Description too short"]
    },
    image:{
        filename:{
            type:String,
        },
        url:{
            type:String,
            default:"https://media.istockphoto.com/id/1256639176/photo/house-and-building-cardboard-cutout-with-fresh-leaves-green-living-community-concept-blue.jpg?s=1024x1024&w=is&k=20&c=3Xpha_gTIfCI-WJCT6v-U1Gc6rJw5wJg5e0gNcAIeEI=",
            set:(v)=> v===""? "https://media.istockphoto.com/id/1256639176/photo/house-and-building-cardboard-cutout-with-fresh-leaves-green-living-community-concept-blue.jpg?s=1024x1024&w=is&k=20&c=3Xpha_gTIfCI-WJCT6v-U1Gc6rJw5wJg5e0gNcAIeEI=":v,
        },
    },
    price:{
        type:Number,
        required:true,
        min:[1, "Price too low for listing..."],
    },
    location:{
        type:String,
        required:true,
        minLength:[1, "Location too short"],
        maxLength:[500, "Location too long"],
    },
    country:{
        type:String,
        required:true,
        minLength:[1, "Country name too short"],
        maxLength:[200, "Country name too long"],
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});
listingSchema.post("findOneAndDelete", async (del)=>{
    let d=await Review.deleteMany({_id:{$in:del.reviews}});
    console.log(d);
});

const Listing=new mongoose.model("Listing", listingSchema);

module.exports=Listing;