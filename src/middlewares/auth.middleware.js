import { Apierror } from "../utilis/Apierror.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.body.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token) {
            throw new Apierror(401, "Unauthorized Access")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new Apierror(401, "Invalid Access Token")
        }
        next()
    } catch (error) {
        throw new Apierror(401, error?.message || "Invalid accesss token")
    }
})
