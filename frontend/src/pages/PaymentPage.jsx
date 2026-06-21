import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, MapPin, MoveRight, Loader } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import { useAddressStore } from "../stores/useAddressStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatAddressLines } from "../lib/addressUtils";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(
	"pk_test_51ThNRm19s2Dd8NSjVsCAqrWwxlSJLSyTlpt1CTSg18JlRSuIqLFCSzDQ7KEC9eLvdIvPsjyxCW7iki5KwjfqEy1N00yGubXvlN"
);

const PaymentPage = () => {
	const navigate = useNavigate();
	const { cart, total, subtotal, coupon, isCouponApplied } = useCartStore();
	const { selectedAddress } = useAddressStore();
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		if (cart.length === 0) {
			navigate("/cart");
			return;
		}
		if (!selectedAddress) {
			navigate("/shipping-address");
		}
	}, [cart.length, selectedAddress, navigate]);

	if (!selectedAddress || cart.length === 0) {
		return <LoadingSpinner />;
	}

	const savings = subtotal - total;
	const addressLines = formatAddressLines(selectedAddress);

	const handlePayment = async () => {
		setProcessing(true);
		try {
			const stripe = await stripePromise;
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
				couponCode: coupon ? coupon.code : null,
				shippingAddress: selectedAddress,
			});

			const result = await stripe.redirectToCheckout({
				sessionId: res.data.id,
			});

			if (result.error) {
				toast.error(result.error.message || "Payment failed");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to initiate payment");
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className='mb-8'
				>
					<div className='flex items-center gap-2 text-emerald-400'>
						<CreditCard className='h-6 w-6' />
						<h1 className='text-2xl sm:text-3xl font-bold'>Payment</h1>
					</div>
					<p className='mt-2 text-gray-400'>Review your order and complete payment securely.</p>
				</motion.div>

				<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
					<div className='space-y-6 lg:col-span-2'>
						<motion.div
							className='rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-6'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
						>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-lg font-semibold text-white flex items-center gap-2'>
									<MapPin className='h-5 w-5 text-emerald-400' />
									Delivering To
								</h2>
								<Link
									to='/shipping-address'
									className='text-sm text-emerald-400 hover:text-emerald-300'
								>
									Change
								</Link>
							</div>
							<p className='font-medium text-white'>{selectedAddress.fullName}</p>
							<p className='text-sm text-gray-300'>{selectedAddress.phone}</p>
							<div className='mt-2 space-y-0.5 text-sm text-gray-300'>
								{addressLines.map((line) => (
									<p key={line}>{line}</p>
								))}
							</div>
						</motion.div>

						<motion.div
							className='rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-6'
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 }}
						>
							<h2 className='text-lg font-semibold text-white mb-4'>Order Items</h2>
							<div className='space-y-3'>
								{cart.map((item) => (
									<div key={item._id} className='flex items-center justify-between text-sm'>
										<span className='text-gray-300'>
											{item.name} x {item.quantity}
										</span>
										<span className='text-white font-medium'>
											${(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								))}
							</div>
						</motion.div>
					</div>

					<motion.div
						className='rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-6 h-fit'
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
					>
						<p className='text-xl font-semibold text-emerald-400 mb-4'>Order Summary</p>

						<div className='space-y-2 mb-6'>
							<dl className='flex items-center justify-between gap-4'>
								<dt className='text-sm text-gray-300'>Subtotal</dt>
								<dd className='text-sm text-white'>${subtotal.toFixed(2)}</dd>
							</dl>
							{savings > 0 && (
								<dl className='flex items-center justify-between gap-4'>
									<dt className='text-sm text-gray-300'>Savings</dt>
									<dd className='text-sm text-emerald-400'>-${savings.toFixed(2)}</dd>
								</dl>
							)}
							{coupon && isCouponApplied && (
								<dl className='flex items-center justify-between gap-4'>
									<dt className='text-sm text-gray-300'>Coupon ({coupon.code})</dt>
									<dd className='text-sm text-emerald-400'>-{coupon.discountPercentage}%</dd>
								</dl>
							)}
							<dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
								<dt className='text-base font-bold text-white'>Total</dt>
								<dd className='text-base font-bold text-emerald-400'>${total.toFixed(2)}</dd>
							</dl>
						</div>

						<button
							type='button'
							onClick={handlePayment}
							disabled={processing}
							className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors'
						>
							{processing ? (
								<>
									<Loader className='mr-2 h-4 w-4 animate-spin' />
									Processing...
								</>
							) : (
								"Pay Now"
							)}
						</button>

						<div className='mt-4 flex items-center justify-center gap-2'>
							<span className='text-sm text-gray-400'>or</span>
							<Link
								to='/cart'
								className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
							>
								Back to Cart
								<MoveRight size={16} />
							</Link>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
