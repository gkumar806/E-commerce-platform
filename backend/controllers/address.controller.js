import Address from "../models/address.model.js";

const validateAddressFields = (data) => {
	const errors = {};
	const requiredFields = ["fullName", "phone", "houseNo", "street", "city", "state", "pincode"];

	for (const field of requiredFields) {
		if (!data[field]?.trim()) {
			errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
		}
	}

	if (data.phone && !/^\d{10}$/.test(data.phone.trim())) {
		errors.phone = "Mobile number must be exactly 10 digits";
	}

	if (data.alternatePhone && data.alternatePhone.trim() && !/^\d{10}$/.test(data.alternatePhone.trim())) {
		errors.alternatePhone = "Alternate mobile number must be exactly 10 digits";
	}

	if (data.pincode && !/^\d{6}$/.test(data.pincode.trim())) {
		errors.pincode = "PIN code must be exactly 6 digits";
	}

	return errors;
};

const formatShippingAddress = (address) => ({
	fullName: address.fullName,
	phone: address.phone,
	houseNo: address.houseNo,
	street: address.street,
	landmark: address.landmark || "",
	city: address.city,
	state: address.state,
	pincode: address.pincode,
	country: address.country || "India",
});

export const createAddress = async (req, res) => {
	try {
		const errors = validateAddressFields(req.body);
		if (Object.keys(errors).length > 0) {
			return res.status(400).json({ message: "Validation failed", errors });
		}

		const {
			fullName,
			phone,
			alternatePhone,
			email,
			houseNo,
			street,
			landmark,
			city,
			state,
			pincode,
			country,
			addressType,
			isDefault,
		} = req.body;

		const existingCount = await Address.countDocuments({ userId: req.user._id });
		const shouldBeDefault = isDefault || existingCount === 0;

		if (shouldBeDefault) {
			await Address.updateMany({ userId: req.user._id }, { isDefault: false });
		}

		const address = await Address.create({
			userId: req.user._id,
			fullName: fullName.trim(),
			phone: phone.trim(),
			alternatePhone: alternatePhone?.trim() || "",
			email: email?.trim() || "",
			houseNo: houseNo.trim(),
			street: street.trim(),
			landmark: landmark?.trim() || "",
			city: city.trim(),
			state: state.trim(),
			pincode: pincode.trim(),
			country: country?.trim() || "India",
			addressType: addressType || "Home",
			isDefault: shouldBeDefault,
		});

		res.status(201).json(address);
	} catch (error) {
		console.log("Error in createAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAddresses = async (req, res) => {
	try {
		const addresses = await Address.find({ userId: req.user._id }).sort({
			isDefault: -1,
			createdAt: -1,
		});
		res.json(addresses);
	} catch (error) {
		console.log("Error in getAddresses controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAddressById = async (req, res) => {
	try {
		const address = await Address.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!address) {
			return res.status(404).json({ message: "Address not found" });
		}

		res.json(address);
	} catch (error) {
		console.log("Error in getAddressById controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateAddress = async (req, res) => {
	try {
		const address = await Address.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!address) {
			return res.status(404).json({ message: "Address not found" });
		}

		const errors = validateAddressFields({ ...address.toObject(), ...req.body });
		if (Object.keys(errors).length > 0) {
			return res.status(400).json({ message: "Validation failed", errors });
		}

		const {
			fullName,
			phone,
			alternatePhone,
			email,
			houseNo,
			street,
			landmark,
			city,
			state,
			pincode,
			country,
			addressType,
			isDefault,
		} = req.body;

		if (isDefault) {
			await Address.updateMany({ userId: req.user._id }, { isDefault: false });
		}

		address.fullName = fullName.trim();
		address.phone = phone.trim();
		address.alternatePhone = alternatePhone?.trim() || "";
		address.email = email?.trim() || "";
		address.houseNo = houseNo.trim();
		address.street = street.trim();
		address.landmark = landmark?.trim() || "";
		address.city = city.trim();
		address.state = state.trim();
		address.pincode = pincode.trim();
		address.country = country?.trim() || "India";
		address.addressType = addressType || address.addressType;
		address.isDefault = isDefault ?? address.isDefault;

		await address.save();
		res.json(address);
	} catch (error) {
		console.log("Error in updateAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteAddress = async (req, res) => {
	try {
		const address = await Address.findOneAndDelete({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!address) {
			return res.status(404).json({ message: "Address not found" });
		}

		if (address.isDefault) {
			const nextDefault = await Address.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
			if (nextDefault) {
				nextDefault.isDefault = true;
				await nextDefault.save();
			}
		}

		res.json({ message: "Address deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const setDefaultAddress = async (req, res) => {
	try {
		const address = await Address.findOne({
			_id: req.params.id,
			userId: req.user._id,
		});

		if (!address) {
			return res.status(404).json({ message: "Address not found" });
		}

		await Address.updateMany({ userId: req.user._id }, { isDefault: false });
		address.isDefault = true;
		await address.save();

		res.json(address);
	} catch (error) {
		console.log("Error in setDefaultAddress controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export { formatShippingAddress };
