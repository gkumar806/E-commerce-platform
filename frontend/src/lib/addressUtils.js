export const INDIAN_STATES = [
	"Andhra Pradesh",
	"Arunachal Pradesh",
	"Assam",
	"Bihar",
	"Chhattisgarh",
	"Goa",
	"Gujarat",
	"Haryana",
	"Himachal Pradesh",
	"Jharkhand",
	"Karnataka",
	"Kerala",
	"Madhya Pradesh",
	"Maharashtra",
	"Manipur",
	"Meghalaya",
	"Mizoram",
	"Nagaland",
	"Odisha",
	"Punjab",
	"Rajasthan",
	"Sikkim",
	"Tamil Nadu",
	"Telangana",
	"Tripura",
	"Uttar Pradesh",
	"Uttarakhand",
	"West Bengal",
	"Andaman and Nicobar Islands",
	"Chandigarh",
	"Dadra and Nagar Haveli and Daman and Diu",
	"Delhi",
	"Jammu and Kashmir",
	"Ladakh",
	"Lakshadweep",
	"Puducherry",
];

export const ADDRESS_TYPES = ["Home", "Office", "Other"];

export const EMPTY_ADDRESS_FORM = {
	fullName: "",
	phone: "",
	alternatePhone: "",
	email: "",
	houseNo: "",
	street: "",
	landmark: "",
	city: "",
	state: "",
	pincode: "",
	country: "India",
	addressType: "Home",
	saveAddress: true,
};

export const validateAddressForm = (formData) => {
	const errors = {};
	const requiredFields = [
		{ key: "fullName", label: "Full Name" },
		{ key: "phone", label: "Mobile Number" },
		{ key: "houseNo", label: "House / Flat Number" },
		{ key: "street", label: "Street / Area" },
		{ key: "city", label: "City" },
		{ key: "state", label: "State" },
		{ key: "pincode", label: "PIN Code" },
	];

	for (const { key, label } of requiredFields) {
		if (!formData[key]?.trim()) {
			errors[key] = `${label} is required`;
		}
	}

	if (formData.phone && !/^\d{10}$/.test(formData.phone.trim())) {
		errors.phone = "Mobile number must be exactly 10 digits";
	}

	if (formData.alternatePhone?.trim() && !/^\d{10}$/.test(formData.alternatePhone.trim())) {
		errors.alternatePhone = "Alternate mobile number must be exactly 10 digits";
	}

	if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
		errors.pincode = "PIN code must be exactly 6 digits";
	}

	return errors;
};

export const toShippingAddress = (address) => ({
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

export const formatAddressLines = (address) => {
	if (!address) return [];
	const lines = [
		address.houseNo,
		address.street,
		address.landmark,
		address.city,
		address.state,
		address.pincode,
	].filter(Boolean);
	return lines;
};
