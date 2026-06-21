import { Loader } from "lucide-react";
import { INDIAN_STATES, ADDRESS_TYPES, validateAddressForm } from "../lib/addressUtils";
import { useState } from "react";

const inputClass =
	"block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm";

const labelClass = "block text-sm font-medium text-gray-300";

const AddressForm = ({
	initialData,
	onSubmit,
	onCancel,
	submitLabel = "Save Address",
	showSaveCheckbox = true,
	loading = false,
}) => {
	const [formData, setFormData] = useState(initialData);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validationErrors = validateAddressForm(formData);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
				<div className='sm:col-span-2'>
					<label htmlFor='fullName' className={labelClass}>
						Full Name *
					</label>
					<input
						id='fullName'
						name='fullName'
						value={formData.fullName}
						onChange={handleChange}
						className={`mt-1 ${inputClass} ${errors.fullName ? "border-red-500" : ""}`}
						placeholder='John Doe'
					/>
					{errors.fullName && <p className='mt-1 text-xs text-red-400'>{errors.fullName}</p>}
				</div>

				<div>
					<label htmlFor='phone' className={labelClass}>
						Mobile Number *
					</label>
					<input
						id='phone'
						name='phone'
						value={formData.phone}
						onChange={handleChange}
						maxLength={10}
						className={`mt-1 ${inputClass} ${errors.phone ? "border-red-500" : ""}`}
						placeholder='9876543210'
					/>
					{errors.phone && <p className='mt-1 text-xs text-red-400'>{errors.phone}</p>}
				</div>

				<div>
					<label htmlFor='alternatePhone' className={labelClass}>
						Alternate Mobile Number
					</label>
					<input
						id='alternatePhone'
						name='alternatePhone'
						value={formData.alternatePhone}
						onChange={handleChange}
						maxLength={10}
						className={`mt-1 ${inputClass} ${errors.alternatePhone ? "border-red-500" : ""}`}
						placeholder='Optional'
					/>
					{errors.alternatePhone && (
						<p className='mt-1 text-xs text-red-400'>{errors.alternatePhone}</p>
					)}
				</div>

				<div className='sm:col-span-2'>
					<label htmlFor='email' className={labelClass}>
						Email
					</label>
					<input
						id='email'
						name='email'
						type='email'
						value={formData.email}
						onChange={handleChange}
						className={`mt-1 ${inputClass}`}
						placeholder='Optional'
					/>
				</div>

				<div>
					<label htmlFor='houseNo' className={labelClass}>
						House / Flat Number *
					</label>
					<input
						id='houseNo'
						name='houseNo'
						value={formData.houseNo}
						onChange={handleChange}
						className={`mt-1 ${inputClass} ${errors.houseNo ? "border-red-500" : ""}`}
						placeholder='Flat 204'
					/>
					{errors.houseNo && <p className='mt-1 text-xs text-red-400'>{errors.houseNo}</p>}
				</div>

				<div>
					<label htmlFor='street' className={labelClass}>
						Street / Area *
					</label>
					<input
						id='street'
						name='street'
						value={formData.street}
						onChange={handleChange}
						className={`mt-1 ${inputClass} ${errors.street ? "border-red-500" : ""}`}
						placeholder='Sector 62'
					/>
					{errors.street && <p className='mt-1 text-xs text-red-400'>{errors.street}</p>}
				</div>

				<div className='sm:col-span-2'>
					<label htmlFor='landmark' className={labelClass}>
						Landmark
					</label>
					<input
						id='landmark'
						name='landmark'
						value={formData.landmark}
						onChange={handleChange}
						className={`mt-1 ${inputClass}`}
						placeholder='Optional'
					/>
				</div>

				<div>
					<label htmlFor='city' className={labelClass}>
						City *
					</label>
					<input
						id='city'
						name='city'
						value={formData.city}
						onChange={handleChange}
						className={`mt-1 ${inputClass} ${errors.city ? "border-red-500" : ""}`}
						placeholder='Noida'
					/>
					{errors.city && <p className='mt-1 text-xs text-red-400'>{errors.city}</p>}
				</div>

				<div>
					<label htmlFor='state' className={labelClass}>
						State *
					</label>
					<select
						id='state'
						name='state'
						value={formData.state}
						onChange={handleChange}
						className={`mt-1 ${inputClass} ${errors.state ? "border-red-500" : ""}`}
					>
						<option value=''>Select State</option>
						{INDIAN_STATES.map((state) => (
							<option key={state} value={state}>
								{state}
							</option>
						))}
					</select>
					{errors.state && <p className='mt-1 text-xs text-red-400'>{errors.state}</p>}
				</div>

				<div>
					<label htmlFor='pincode' className={labelClass}>
						PIN Code *
					</label>
					<input
						id='pincode'
						name='pincode'
						value={formData.pincode}
						onChange={handleChange}
						maxLength={6}
						className={`mt-1 ${inputClass} ${errors.pincode ? "border-red-500" : ""}`}
						placeholder='201309'
					/>
					{errors.pincode && <p className='mt-1 text-xs text-red-400'>{errors.pincode}</p>}
				</div>

				<div>
					<label htmlFor='country' className={labelClass}>
						Country
					</label>
					<input
						id='country'
						name='country'
						value={formData.country}
						onChange={handleChange}
						className={`mt-1 ${inputClass}`}
						readOnly
					/>
				</div>

				<div>
					<label htmlFor='addressType' className={labelClass}>
						Address Type
					</label>
					<select
						id='addressType'
						name='addressType'
						value={formData.addressType}
						onChange={handleChange}
						className={`mt-1 ${inputClass}`}
					>
						{ADDRESS_TYPES.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
			</div>

			{showSaveCheckbox && (
				<label className='flex items-center gap-2 text-sm text-gray-300'>
					<input
						type='checkbox'
						name='saveAddress'
						checked={formData.saveAddress}
						onChange={handleChange}
						className='rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500'
					/>
					Save this address for future orders
				</label>
			)}

			<div className='flex flex-wrap gap-3 pt-2'>
				<button
					type='submit'
					disabled={loading}
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors'
				>
					{loading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
					{submitLabel}
				</button>
				{onCancel && (
					<button
						type='button'
						onClick={onCancel}
						className='rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors'
					>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
};

export default AddressForm;
