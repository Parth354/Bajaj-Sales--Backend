import mongoose ,{Schema} from "mongoose";
import jwt  from "jsonwebtoken";

const sellerSchema= new Schema({
phoneNo:{
    type:Number,
    unique:true,
    required:true,
},
enterpriseName:{
type:String,
required:true,
},
GSTNo:{
    type:String,
    unique:true,
    index:true
},
adhaarno:{
    type:Number,
    unique:true,
},
products:{
    type:Schema.Types.ObjectId,
    ref:"Products",

},
isVerified:{
    type:Boolean,
    default:false
},
refreshToken:{
    type:String
},
address: {
    type: Schema.Types.ObjectId,
    ref: "address",
},

},{timestamps:true})

sellerSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        phoneNo: this.phoneNo,
        enterpriseName: this.enterpriseName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
sellerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Seller = mongoose.model("Seller",sellerSchema);
