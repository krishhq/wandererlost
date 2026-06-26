const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        // unique:true,
        lowercase:true
    }
});
// console.log(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose.default);

const User=new mongoose.model("User", userSchema);

module.exports=User;

// // Email regex for basic validation
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     unique: true, // Ensures no duplicates
//     validate: {
//       validator: function (v) {
//         return emailRegex.test(v);
//       },
//       message: props => `${props.value} is not a valid email address!`
//     }
//   }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;