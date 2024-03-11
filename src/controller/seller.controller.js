import { Products } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { Address } from "../models/address.model.js"
import { Apierror } from "../utilis/Apierror.js";
import { apiResponse } from "../utilis/apiResponse.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { uploadOnCloudinary } from "../utilis/cloudinary.js";

const options = {
    httpOnly: true,
    secure: true
}
const generateAccessAndRefreshTokens = async (sellerId) => {
    try {
        const seller = await Seller.findById(sellerId)
        const refreshToken = seller.generateRefreshToken()
        const accessToken = seller.generateAccessToken()
        seller.refreshToken = refreshToken
        await seller.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new Apierror(500, "Internal Server Error while Generating Refresh And Access Tokens")
    }
}
const sellerRegister = asyncHandler(async (req, res) => {
    const { phoneNo, enterpriseName, GSTno, state, locality, pincode } = req.body;

    if (!phoneNo) {
        throw new Apierror(404, "Phone Number is necessary");
    }
    const existedseller = await Seller.findOne({ phoneNo })
    if (existedseller) {
        throw new Apierror(409, "Phone Number already exist")
    }
    const addressInstance = await Address.create({
        state,
        locality,
        pincode
    });
    const seller = await Seller.create(
        {
            phoneNo,
            enterpriseName,
            GSTno,
            address: addressInstance
        }
    )
    const createdSeller = await Seller.findById(seller._id).select(
        "-refreshToken"
    )
    if (!createdSeller) {
        throw new Apierror(500, "Internal MogoDB creation Error")
    }
    return res.status(200)
        .json(
            new apiResponse(200, createdSeller, "Seller Registered Successfully")
        )
})
const addProducts = asyncHandler(async (req, res) => {
    const { title, category, price, description,_id } = req.body
    const seller = await Seller.findById(`${_id}`)
    if(!seller){
        throw new Apierror(404,"Seller Not Found")
    }
    const photoLocalPath = req?.file.path;
    const photo = await uploadOnCloudinary(photoLocalPath)

    const product = await Products.create({
        title,
        price,
        description,
        category,
        photos: photo?.url,
        Seller_info:seller
    })

    if (!product) {
        throw new Apierror(404, "Error in creating Product");
    }

    return res.status(200)
        .json(new apiResponse(200, product, "Product created successfully"))

})
const getProduct = asyncHandler(async (req, res) => {

    const existedProduct = Products.find().then((data) => {
        return res.status(200)
            .json(
                new apiResponse(200, data, "fetched the details successfully")
            )
    })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

})
const getProductbyId = asyncHandler(async (req, res) => {
    const { id } = req.body
    const existedProduct = Products.findById(id).then((data) => {
        return res.status(200)
            .json(
                new apiResponse(200, data, "fetched the details successfully")
            )
    })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
})
const sellerLogin = asyncHandler(async (req, res) => {

    const { phoneNo} = req.body
    if (!phoneNo) {
        throw new Apierror(400, "Phone Number is Required")
    }

    const seller = await Seller.findOne({ phoneNo })
    if (!seller) {
        throw new Apierror(404, "Phone Number does not Exist")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(seller._id)
    const loggedInSeller = await Seller.findById(seller._id).select("-refreshToken")
    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInSeller, accessToken, refreshToken
                },
                "User Logged in Successfully"
            )
        )
})
const logoutSeller = asyncHandler(async (req, res) => {
    console.log("request recieved")
    await Seller.findByIdAndUpdate(req.body._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    console.log("done")
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User Logout Successfully")
        )
})

export { logoutSeller,sellerRegister, addProducts, getProduct, getProductbyId, sellerLogin }