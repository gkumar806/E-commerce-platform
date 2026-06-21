import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin } from "lucide-react";
import { useAddressStore } from "../stores/useAddressStore";
import { useCartStore } from "../stores/useCartStore";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { EMPTY_ADDRESS_FORM, toShippingAddress } from "../lib/addressUtils";

const ShippingAddressPage = () => {
	const navigate = useNavigate();
	const { cart } = useCartStore();
	const {
		addresses,
		loading,
		getAddresses,
		createAddress,
		setSelectedAddress,
	} = useAddressStore();

	const [showForm, setShowForm] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (cart.length === 0) {
			navigate("/cart");
			return;
		}
		getAddresses();
	}, [cart.length, getAddresses, navigate]);

	useEffect(() => {
		if (!loading && addresses.length === 0) {
			setShowForm(true);
		}
	}, [loading, addresses.length]);

	const handleDeliverHere = (address) => {
		setSelectedAddress(address);
		navigate("/payment");
	};

	const handleFormSubmit = async (formData) => {
		setSubmitting(true);
		try {
			let addressToUse;

			if (formData.saveAddress) {
				addressToUse = await createAddress({
					...formData,
					isDefault: addresses.length === 0,
				});
			} else {
				addressToUse = toShippingAddress(formData);
			}

			setSelectedAddress(addressToUse);
			navigate("/payment");
		} catch {
			// errors handled in store
		} finally {
			setSubmitting(false);
		}
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
					transition={{ duration: 0.4 }}
					className='mb-8'
				>
					<div className='flex items-center gap-2 text-emerald-400'>
						<MapPin className='h-6 w-6' />
						<h1 className='text-2xl sm:text-3xl font-bold'>Shipping Address</h1>
					</div>
					<p className='mt-2 text-gray-400'>
						Select a saved address or add a new one to continue to payment.
					</p>
				</motion.div>

				{addresses.length > 0 && !showForm && (
					<div className='space-y-6'>
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
							{addresses.map((address) => (
								<AddressCard
									key={address._id}
									address={address}
									showDeliver
									showManageActions={false}
									onDeliver={handleDeliverHere}
								/>
							))}
						</div>

						<button
							type='button'
							onClick={() => setShowForm(true)}
							className='inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-900/30 transition-colors'
						>
							<Plus className='h-4 w-4' />
							Add New Address
						</button>
					</div>
				)}

				{(showForm || addresses.length === 0) && (
					<motion.div
						className='mt-6 rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-6'
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
					>
						<h2 className='mb-4 text-lg font-semibold text-white'>
							{addresses.length > 0 ? "Add New Address" : "Enter Delivery Address"}
						</h2>
						<AddressForm
							initialData={EMPTY_ADDRESS_FORM}
							onSubmit={handleFormSubmit}
							onCancel={addresses.length > 0 ? () => setShowForm(false) : undefined}
							submitLabel='Continue to Payment'
							showSaveCheckbox
							loading={submitting}
						/>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default ShippingAddressPage;
