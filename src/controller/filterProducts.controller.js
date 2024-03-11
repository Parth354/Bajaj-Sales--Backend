import { Products } from "../models/product.model.js";
import { Apierror } from "../utilis/Apierror.js";
import { apiResponse } from "../utilis/apiResponse.js";
import { asyncHandler } from "../utilis/asyncHandler.js";

const handleSearch= asyncHandler(async(req,res)=>{

    const query = req.query.q;
    if(!query){
        throw new Apierror(404,"send a valid query")
    }
    const results = await Products.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
        ]
    });
    return res.status(200)
    .json(
        new apiResponse(200,results,"Search successfully")
    )
})


export{handleSearch}