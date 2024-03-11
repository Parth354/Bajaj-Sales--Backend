import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    locality: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
        default:"India"
    },
    pincode: {
        type: Number,
        required: true
    },


})

export const Address = mongoose.model("Address", addressSchema)