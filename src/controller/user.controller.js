import { asyncHandler } from "../utilis/asyncHandler.js"
import { Apierror } from "../utilis/Apierror.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utilis/apiResponse.js";


const options = {
    httpOnly: true,
    secure: true
}
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new Apierror(500, "Internal Server Error while Generating Refresh And Access Tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, isVerified } = req.body

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new Apierror(400, "All fields are required")
    }
    const existedUser = await User.findOne({ email })
    if (existedUser) {
        throw new Apierror(409, "User with email or username already exist")
    }

    const user = await User.create({
        name,
        email,
        password,
        isVerified
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new Apierror(500, "Something went while registering the User")
    }

    return res.status(200).json(
        new apiResponse(200, createdUser, "User Registered Successfully")
    )
})

// const sessionOTPMap = new Map();
// const emailOTP = asyncHandler(async (req, res) => {
//     const { email } = req.body;
//     const OTP = await OTPEmail(email);
//     const sessionId = uuidv4();
//     sessionOTPMap.set(sessionId, OTP);
//     res.status(200).json({ sessionId });
// });

// const verifyOTP = asyncHandler(async (req, res) => {
//     const { sessionId, OTP } = req.body;
//     if (!sessionId || !sessionOTPMap.has(sessionId)) {
//         return res.status(400).json({ message: "Invalid session ID", isVerified: "false" });
//     }
//     const storedOTP = sessionOTPMap.get(sessionId);
//     if (OTP !== storedOTP) {
//         return res.status(400).json({ message: "Invalid OTP", isVerified: "false" });
//     }
//     sessionOTPMap.delete(sessionId);
//     res.status(200).json({ message: "OTP verification successful", isVerified: "true" });
// });

const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        throw new Apierror(400, "Email is Required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new Apierror(404, "Email does not Exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new Apierror(401, "Wrong Password")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged in Successfully"
            )
        )
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.body._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
        .json(
            new apiResponse(200, {}, "User Logout Successfully")
        )
})
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(apiResponse(200, req.user, "current user fetched successfully"))
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { state, locality, pincode, age, _id } = req.body
    const user = await User.findById(_id)
    console.log(user)
    if (!user) {
        throw new Apierror(404, "User Not Found")
    }
    const avatarLocalPath = req?.file.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (state) user.state = state;
    if (locality) user.locality = locality;
    if (pincode) user.pincode = pincode;
    if (age) user.age = age;
    user.avatar = avatar?.url;
    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200).json(
        new apiResponse(200, updatedUser, "Update Successfully")
    )
})
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
     
    const user = await User.findById(req.body?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new Apierror(400, "Invalid Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new apiResponse(200, {}, "Password changed successfully!!")
        )
})


export { changeCurrentPassword,updateUserDetails, logoutUser, userLogin, registerUser, getCurrentUser }

