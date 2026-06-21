import express from "express";
import {
	createAddress,
	getAddresses,
	getAddressById,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
} from "../controllers/address.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createAddress);
router.get("/", protectRoute, getAddresses);
router.patch("/default/:id", protectRoute, setDefaultAddress);
router.get("/:id", protectRoute, getAddressById);
router.put("/:id", protectRoute, updateAddress);
router.delete("/:id", protectRoute, deleteAddress);

export default router;
