import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({

    Seller_info: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    User_info: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    Product_info: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },

    quantity:{
        type:Number,
        required:true
    },

    OrderAmount:{
        type:Number,
        required:true
    },

    status: {
        type: String,
        enum: ['Order Placed(In Process)', 'Order Recieved', 'Out For Delivery','Delivered(Order Closed)','Order Cancelled'],
        default:'Order Placed(In Process)'
    }


}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)