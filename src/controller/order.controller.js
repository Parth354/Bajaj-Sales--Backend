import { Order } from "../models/order.model.js";
import { Apierror } from "../utilis/Apierror.js";
import { apiResponse } from "../utilis/apiResponse.js";
import { asyncHandler } from "../utilis/asyncHandler.js";


const PlaceOrders =asyncHandler(async(req,res)=>{
      const {seller_id, prod_id , user_id ,quantity , totalAmount}=req.body
})

const getOrderStatus = asyncHandler(async(req, res) => {
      try {
          const { _id } = req.body;
          const order = await Order.findOne({ _id });
  
          if (!order) {
              throw new Apierror(400, "Wrong Id");
          }
  
          return res.status(200).json(new apiResponse(200, `${order.status}`));
      } catch (error) {
          console.error('Error:', error);
          return res.status(500).json(new apiResponse(500, 'Internal Server Error'));
      }
  });
  

export {getOrderStatus}