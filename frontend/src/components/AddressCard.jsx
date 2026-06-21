import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

const AddressCard = ({
	address,
	onDeliver,
	onEdit,
	onDelete,
	onSetDefault,
	showDeliver = false,
	showManageActions = true,
}) => {
	return (
		<motion.div
			className={`rounded-lg border p-4 sm:p-5 ${
				address.isDefault ? "border-emerald-500 bg-gray-800/80" : "border-gray-700 bg-gray-800"
			}`}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className='flex items-start justify-between gap-3'>
				<div className='flex items-center gap-2'>
					<MapPin className='h-5 w-5 text-emerald-400 shrink-0' />
					<div>
						<p className='font-semibold text-white'>{address.fullName}</p>
						<p className='text-sm text-gray-300'>{address.phone}</p>
					</div>
				</div>
				<span className='rounded-full bg-gray-700 px-2 py-0.5 text-xs text-emerald-400'>
					{address.addressType}
				</span>
			</div>

			<div className='mt-3 space-y-0.5 text-sm text-gray-300'>
				<p>{address.houseNo}</p>
				<p>{address.street}</p>
				{address.landmark && <p>{address.landmark}</p>}
				<p>{address.city}</p>
				<p>{address.state}</p>
				<p>{address.pincode}</p>
			</div>

			{address.isDefault && (
				<div className='mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-400'>
					<Star className='h-3.5 w-3.5 fill-emerald-400' />
					Default
				</div>
			)}

			<div className='mt-4 flex flex-wrap gap-2'>
				{showDeliver && onDeliver && (
					<button
						type='button'
						onClick={() => onDeliver(address)}
						className='rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors'
					>
						Deliver Here
					</button>
				)}
				{showManageActions && onEdit && (
					<button
						type='button'
						onClick={() => onEdit(address)}
						className='rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 transition-colors'
					>
						Edit
					</button>
				)}
				{showManageActions && onDelete && (
					<button
						type='button'
						onClick={() => onDelete(address._id)}
						className='rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/30 transition-colors'
					>
						Delete
					</button>
				)}
				{showManageActions && !address.isDefault && onSetDefault && (
					<button
						type='button'
						onClick={() => onSetDefault(address._id)}
						className='rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-900/30 transition-colors'
					>
						Set as Default
					</button>
				)}
			</div>
		</motion.div>
	);
};

export default AddressCard;
