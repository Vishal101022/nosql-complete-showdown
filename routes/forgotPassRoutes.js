const express = require("express");
const router = express.Router();
const forgotPassController = require("../controllers/forgotPassController");

router.post("/forgotpassword", forgotPassController.forgot);
router.get("/resetpassword/:id", forgotPassController.reset);
router.post("/update", forgotPassController.update);


module.exports = router;