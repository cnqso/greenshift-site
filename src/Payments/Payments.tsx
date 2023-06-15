/** @format */

import { useState, useEffect, useContext } from "react";
import { ErrorContext } from "../assets/errors";

const Message = ({ message }: { message: any }) => (
	<section>
		<p>{message}</p>
	</section>
);

export default function Payments({ sendToCluod, userPreferences }: any) {
	let [message, setMessage] = useState("");
	let [success, setSuccess] = useState(false);
	let [sessionId, setSessionId] = useState<any>("");
	const { setError } = useContext(ErrorContext);

	const createCheckoutSession = async () => {
		const checkoutSession = await sendToCluod("create-checkout-session", { nothin: "nothing" }, setError);
		console.log(checkoutSession);
		window.location.href = checkoutSession.sessionURL;
	};

	const createPortalSession = async () => {
		const portalSession = await sendToCluod("create-portal-session", { nothin: "nothing" }, setError);
		console.log(portalSession);
		window.location.href = portalSession.sessionURL;
	};

	useEffect(() => {
		// Check to see if this is a redirect back from Checkout
		const query = new URLSearchParams(window.location.search);

		if (query.get("success")) {
			setSuccess(true);
			setSessionId(query.get("session_id"));
		}

		if (query.get("canceled")) {
			setSuccess(false);
			setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
		}
	}, [sessionId]);

	const subscriptionExpiration = parseInt(userPreferences?.subscription_expiration ?? "000");
	const subscriptionLapsed = subscriptionExpiration*1000 < Date.now();
	const premium = userPreferences?.subscription === "premium";
	const stripeId = userPreferences?.stripeId;
	console.log(subscriptionExpiration, Date.now(), subscriptionLapsed, premium, stripeId)

	return (
		<div>
			{message && <Message message={message} />}
			{(!premium || subscriptionLapsed) && (
				<section>
					<div className='product'>
						<Logo />
						<div className='description'>
							<h3>Piaget Bot Premium Subscription</h3>
							<h5>$5.00 / month</h5>
						</div>
					</div>
					<button onClick={createCheckoutSession}>Checkout with Stripe</button>
				</section>
			)}
			{stripeId && (
				<section>
					<div className='product Box-root'>
						<Logo />
						<div className='description Box-root'>
							{!subscriptionLapsed && (<h3>Subscription to Piaget Bot Premium successful!</h3>)}
						</div>
					</div>
					<button onClick={createPortalSession}>Manage Billing Information</button>
				</section>
			)}
		</div>
	);
}

const Logo = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		xmlnsXlink='http://www.w3.org/1999/xlink'
		width='14px'
		height='16px'
		viewBox='0 0 14 16'
		version='1.1'>
		<defs />
		<g id='Flow' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
			<g id='0-Default' transform='translate(-121.000000, -40.000000)' fill='#E184DF'>
				<path
					d='M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z'
					id='Pilcrow'
				/>
			</g>
		</g>
	</svg>
);
