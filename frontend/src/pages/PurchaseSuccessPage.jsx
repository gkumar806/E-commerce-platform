import { ArrowRight, CheckCircle, HandHeart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useAddressStore } from "../stores/useAddressStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatAddressLines } from "../lib/addressUtils";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const { clearSelectedAddress } = useAddressStore();
	const [error, setError] = useState(null);
	const [order, setOrder] = useState(null);

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId) => {
			try {
				const res = await axios.post("/payments/checkout-success", {
					sessionId,
				});
				setOrder(res.data.order);
				clearCart();
				clearSelectedAddress();
			} catch (err) {
				console.log(err);
				setError(err.response?.data?.message || "Failed to confirm order");
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get("session_id");
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError("No session ID found in the URL");
		}
	}, [clearCart, clearSelectedAddress]);

	if (isProcessing) return <LoadingSpinner />;

	if (error) {
		return (
			<div className='flex h-screen items-center justify-center px-4'>
				<div className='max-w-md w-full rounded-lg bg-gray-800 p-6 text-center'>
					<p className='text-red-400'>{error}</p>
					<Link to='/' className='mt-4 inline-block text-emerald-400 hover:text-emerald-300'>
						Go Home
					</Link>
				</div>
			</div>
		);
	}

	const shippingAddress = order?.shippingAddress;
	const addressLines = formatAddressLines(shippingAddress);

	return (
		<div className='h-screen flex items-center justify-center px-4'>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>

			<div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
				<div className='p-6 sm:p-8'>
					<div className='flex justify-center'>
						<CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
					</div>
					<h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
						Order Successfully Placed
					</h1>

					<p className='text-gray-300 text-center mb-6'>
						Thank you for your order. {"We're"} processing it now.
					</p>

					{shippingAddress && (
						<div className='bg-gray-700 rounded-lg p-4 mb-4'>
							<div className='flex items-center gap-2 mb-2 text-emerald-400'>
								<MapPin className='h-4 w-4' />
								<span className='text-sm font-semibold'>Delivering To:</span>
							</div>
							<p className='font-medium text-white'>{shippingAddress.fullName}</p>
							<div className='mt-1 space-y-0.5 text-sm text-gray-300'>
								{addressLines.map((line) => (
									<p key={line}>{line}</p>
								))}
							</div>
						</div>
					)}

					<div className='bg-gray-700 rounded-lg p-4 mb-6'>
						{order?._id && (
							<div className='flex items-center justify-between mb-2'>
								<span className='text-sm text-gray-400'>Order number</span>
								<span className='text-sm font-semibold text-emerald-400'>
									#{order._id.slice(-6).toUpperCase()}
								</span>
							</div>
						)}
						<div className='flex items-center justify-between'>
							<span className='text-sm text-gray-400'>Estimated delivery</span>
							<span className='text-sm font-semibold text-emerald-400'>3–5 Days</span>
						</div>
					</div>

					<div className='space-y-4'>
						<button
							className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg transition duration-300 flex items-center justify-center'
						>
							<HandHeart className='mr-2' size={18} />
							Thanks for trusting us!
						</button>
						<Link
							to='/'
							className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4
            rounded-lg transition duration-300 flex items-center justify-center'
						>
							Continue Shopping
							<ArrowRight className='ml-2' size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;
