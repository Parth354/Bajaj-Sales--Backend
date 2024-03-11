import mongoose,{Schema} from "mongoose";

const productSchema = new Schema ({
    title:{
        type:String,
        required:true,
        index:true,
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    photos:{
        type:String// cloudinary url
    },
    Seller_info:{
        type: Schema.Types.ObjectId,
        ref:"Seller",
        required:true
     }
}) 

export const Products= mongoose.model("Products",productSchema)