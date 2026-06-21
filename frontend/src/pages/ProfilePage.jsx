import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, User } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useAddressStore } from "../stores/useAddressStore";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { EMPTY_ADDRESS_FORM } from "../lib/addressUtils";

const ProfilePage = () => {
	const { user } = useUserStore();
	const {
		addresses,
		loading,
		getAddresses,
		createAddress,
		updateAddress,
		deleteAddress,
		setDefaultAddress,
	} = useAddressStore();

	const [showForm, setShowForm] = useState(false);
	const [editingAddress, setEditingAddress] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		getAddresses();
	}, [getAddresses]);

	const handleEdit = (address) => {
		setEditingAddress(address);
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this address?")) {
			await deleteAddress(id);
		}
	};

	const handleFormSubmit = async (formData) => {
		setSubmitting(true);
		try {
			if (editingAddress) {
				await updateAddress(editingAddress._id, {
					...formData,
					isDefault: editingAddress.isDefault,
				});
			} else {
				await createAddress({
					...formData,
					isDefault: formData.saveAddress,
				});
			}
			setShowForm(false);
			setEditingAddress(null);
		} catch {
			// errors handled in store
		} finally {
			setSubmitting(false);
		}
	};

	const handleCancelForm = () => {
		setShowForm(false);
		setEditingAddress(null);
	};

	const getFormInitialData = () => {
		if (!editingAddress) return EMPTY_ADDRESS_FORM;

		return {
			fullName: editingAddress.fullName,
			phone: editingAddress.phone,
			alternatePhone: editingAddress.alternatePhone || "",
			email: editingAddress.email || "",
			houseNo: editingAddress.houseNo,
			street: editingAddress.street,
			landmark: editingAddress.landmark || "",
			city: editingAddress.city,
			state: editingAddress.state,
			pincode: editingAddress.pincode,
			country: editingAddress.country || "India",
			addressType: editingAddress.addressType,
			saveAddress: true,
		};
	};

	if (loading && addresses.length === 0) {
		return <LoadingSpinner />;
	}

	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className='mb-8'
				>
					<div className='flex items-center gap-2 text-emerald-400'>
						<User className='h-6 w-6' />
						<h1 className='text-2xl sm:text-3xl font-bold'>My Profile</h1>
					</div>
					<p className='mt-2 text-gray-400'>Welcome back, {user?.name}</p>
				</motion.div>

				<motion.div
					className='rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-6'
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
						<div className='flex items-center gap-2'>
							<MapPin className='h-5 w-5 text-emerald-400' />
							<h2 className='text-xl font-semibold text-white'>My Addresses</h2>
						</div>
						{!showForm && (
							<button
								type='button'
								onClick={() => {
									setEditingAddress(null);
									setShowForm(true);
								}}
								className='inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors'
							>
								<Plus className='h-4 w-4' />
								Add New Address
							</button>
						)}
					</div>

					{showForm && (
						<div className='mb-8 rounded-lg border border-gray-600 bg-gray-900/50 p-4 sm:p-6'>
							<h3 className='mb-4 text-lg font-medium text-white'>
								{editingAddress ? "Edit Address" : "Add New Address"}
							</h3>
							<AddressForm
								key={editingAddress?._id || "new"}
								initialData={getFormInitialData()}
								onSubmit={handleFormSubmit}
								onCancel={handleCancelForm}
								submitLabel={editingAddress ? "Update Address" : "Save Address"}
								showSaveCheckbox={false}
								loading={submitting}
							/>
						</div>
					)}

					{addresses.length === 0 && !showForm ? (
						<p className='text-gray-400 text-center py-8'>
							No saved addresses yet. Add one to speed up checkout.
						</p>
					) : (
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
							{addresses.map((address) => (
								<AddressCard
									key={address._id}
									address={address}
									showDeliver={false}
									showManageActions
									onEdit={handleEdit}
									onDelete={handleDelete}
									onSetDefault={setDefaultAddress}
								/>
							))}
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default ProfilePage;
