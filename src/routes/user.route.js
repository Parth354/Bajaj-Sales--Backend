import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
import { getCurrentUser,  registerUser, userLogin, logoutUser, updateUserDetails, changeCurrentPassword } from "../controller/user.controller.js";
import { addProducts, getProduct, getProductbyId, sellerLogin, sellerRegister } from "../controller/seller.controller.js";
import smsotp from "../utilis/smsOtp.js";
import verifyOTP from "../utilis/verifyOTP.js";
import { handleSearch } from "../controller/filterProducts.controller.js";
import { getOrderStatus } from "../controller/order.controller.js";
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(userLogin)
router.route("/seller-register").post(sellerRegister)
router.route("/seller-login").post(sellerLogin)
router.route("/add-product").post(upload.single("photos"), addProducts)
router.route("/product-details").get(getProduct)
router.route("/getProductbyId").post(getProductbyId)
router.route("/smsOTP").post(smsotp)
router.route("/verifyOTP").post(verifyOTP)
router.route('/search').get(handleSearch)
router.route('/filter').get(handleSearch)
router.route('/order-status').post(getOrderStatus)
//secured routes
router.route("/update-userDetails").post(verifyJWT,upload.single("avatar"),updateUserDetails)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser)

export default router