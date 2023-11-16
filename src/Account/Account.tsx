/** @format */

// src/components/Account.tsx
import React, { useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import type { UserPreferences, UserInfo } from "../@types/internal.types";
import { Link } from "react-router-dom";
import { ErrorContext } from "../assets/errors";
// import UserDataComponent from '../UserData';
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { Authenticator } from "@aws-amplify/ui-react";

function AccountModal({
	show,
	onClose,
	userPreferences,
	userInfo,
	updateUserInfo,
	updateUserPreferences,
	toggleAccountModal,
	sendToCluod,
}: {
	show: boolean;
	onClose: () => void;
	userPreferences: UserPreferences | null;
	userInfo: UserInfo | null;
	updateUserInfo: Function;
	updateUserPreferences: Function;
	toggleAccountModal: any;
	sendToCluod: Function;
}) {
	const { setError } = useContext(ErrorContext);

	if (!show) return null;

	const formFields = {
		signIn: {
			username: {
				placeholder: "Enter Your Email or Username",
				isRequired: true,
				label: "Email:",
			},
		},
	};

	function seePreferences() {
		console.log("see generations");
		updateUserPreferences();
	}

	const createPortalSession = async () => {
		const portalSession = await sendToCluod("create-portal-session", { nothin: "nothing" }, setError);
		console.log(portalSession);
		window.location.href = portalSession.sessionURL;
	};

	const subscriptionExpiration = new Date(
		parseInt(userPreferences?.subscription_expiration ?? "1") * 1000
	).toLocaleString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<Modal open={show} onClose={onClose}>
			<Box
				sx={{
					color: "#000000",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					maxWidth: 750,
					minWidth: 375,
					bgcolor: "#fff",
					borderRadius: 2,
					boxShadow: 24,
					p: 4,
				}}>
				<Authenticator formFields={formFields}>
					{({ signOut, user }) => (
						<div>
							<div style={{ maxWidth: "100%", maxHeight: "600px", whiteSpace: "break-spaces" }}>
								{userInfo ? (
									<div>
										<div style={{ fontSize: "1.3em" }}>
											<span>Hello, {userInfo["username"]}</span>
										</div>
										<div>
											<span>Email: {userInfo["email"]}</span>
										</div>

										{userPreferences?.subscription === "premium" ? (
											<>
												<div>
													<span>
														Account Plan: Premium
														<button
															onClick={createPortalSession}
															style={{ fontSize: "0.85em", marginLeft: "8px" }}>
															Manage Subscription
														</button>
													</span>
												</div>
												<div>
													<span>
														Subscription renewal: {subscriptionExpiration}
													</span>
												</div>
												{/* <div>
												
													<span>
														Stripe ID: {userPreferences?.stripeId ?? "..."}
													</span>
												</div> */}
											</>
										) : (
											<>
												<div>
													<div>
														<span>
															Credits: {userPreferences?.credits ?? "..."}
														</span>
													</div>
													<span>Account Plan: Basic</span>
													<Link
														to='/premium'
														onClick={toggleAccountModal}
														className='premiumTag'>
														Go Premium!
													</Link>
												</div>
												<div></div>
												{/* <div>
													<span>
														Stripe ID: {userPreferences?.stripeId ?? "..."}
													</span>
												</div> */}
											</>
										)}
										<Link
											to='/generations'
											onClick={toggleAccountModal}
											className='linkButton'
											style={{ marginBlock: "7px" }}>
											Generation History
										</Link>
									</div>
								) : (
									<p>Loading user info...</p>
								)}

								<button onClick={signOut}>Sign out</button>
							</div>
						</div>
					)}
				</Authenticator>
			</Box>
		</Modal>
	);
}

export default AccountModal;
