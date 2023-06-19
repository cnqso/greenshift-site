/** @format */

import { useState, useEffect, useContext } from "react";
import { ErrorContext } from "../assets/errors";
import booksvg from "../assets/svgs/book.svg";

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
	<img src={booksvg} style={{width: '200px', height: '200px'}}/>
);
