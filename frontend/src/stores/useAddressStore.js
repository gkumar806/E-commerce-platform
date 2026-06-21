import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { toShippingAddress } from "../lib/addressUtils";

export const useAddressStore = create((set, get) => ({
	addresses: [],
	selectedAddress: null,
	loading: false,

	getAddresses: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/address");
			set({ addresses: res.data, loading: false });
			return res.data;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch addresses");
			return [];
		}
	},

	createAddress: async (formData) => {
		set({ loading: true });
		try {
			const payload = {
				fullName: formData.fullName,
				phone: formData.phone,
				alternatePhone: formData.alternatePhone,
				email: formData.email,
				houseNo: formData.houseNo,
				street: formData.street,
				landmark: formData.landmark,
				city: formData.city,
				state: formData.state,
				pincode: formData.pincode,
				country: formData.country,
				addressType: formData.addressType,
				isDefault: formData.isDefault ?? formData.saveAddress,
			};

			const res = await axios.post("/address", payload);
			set((state) => ({
				addresses: [res.data, ...state.addresses.filter((a) => a._id !== res.data._id)].sort(
					(a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
				),
				loading: false,
			}));
			toast.success("Address saved successfully");
			return res.data;
		} catch (error) {
			set({ loading: false });
			const apiErrors = error.response?.data?.errors;
			if (apiErrors) {
				toast.error(Object.values(apiErrors)[0]);
			} else {
				toast.error(error.response?.data?.message || "Failed to save address");
			}
			throw error;
		}
	},

	updateAddress: async (id, formData) => {
		set({ loading: true });
		try {
			const payload = {
				fullName: formData.fullName,
				phone: formData.phone,
				alternatePhone: formData.alternatePhone,
				email: formData.email,
				houseNo: formData.houseNo,
				street: formData.street,
				landmark: formData.landmark,
				city: formData.city,
				state: formData.state,
				pincode: formData.pincode,
				country: formData.country,
				addressType: formData.addressType,
				isDefault: formData.isDefault,
			};

			const res = await axios.put(`/address/${id}`, payload);
			await get().getAddresses();
			toast.success("Address updated successfully");
			return res.data;
		} catch (error) {
			set({ loading: false });
			const apiErrors = error.response?.data?.errors;
			if (apiErrors) {
				toast.error(Object.values(apiErrors)[0]);
			} else {
				toast.error(error.response?.data?.message || "Failed to update address");
			}
			throw error;
		}
	},

	deleteAddress: async (id) => {
		set({ loading: true });
		try {
			await axios.delete(`/address/${id}`);
			await get().getAddresses();
			if (get().selectedAddress?._id === id) {
				set({ selectedAddress: null });
			}
			toast.success("Address deleted successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to delete address");
		}
	},

	setDefaultAddress: async (id) => {
		set({ loading: true });
		try {
			const res = await axios.patch(`/address/default/${id}`);
			set((state) => ({
				addresses: state.addresses
					.map((a) => ({ ...a, isDefault: a._id === res.data._id }))
					.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)),
				loading: false,
			}));
			toast.success("Default address updated");
			return res.data;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to set default address");
		}
	},

	setSelectedAddress: (address) => {
		set({ selectedAddress: address ? toShippingAddress(address) : null });
	},

	clearSelectedAddress: () => {
		set({ selectedAddress: null });
	},
}));
