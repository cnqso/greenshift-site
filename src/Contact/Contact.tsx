/** @format */

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion, Reorder, AnimatePresence, LayoutGroup } from "framer-motion";
import "./Contact.css";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from "../assets/svgs/bookLite.svg";
import CheckIcon from "../assets/svgs/book.svg";
import ErrorIcon from "../assets/svgs/book.svg";
import { styled, createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

interface IFormInput {
	name: string;
	email: string;
	message: string;
}

function Contact() {
	const [formInput, setFormInput] = useState<IFormInput>({
		name: "",
		email: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
	const [submissionError, setSubmissionError] = useState<boolean>(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setFormInput((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setSubmissionSuccess(false);
		setSubmissionError(false);
		try {
			const response = await fetch("https://formsubmit.co/d166b1a93693ca8e0027e61a19444137", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formInput),
			});

			setIsSubmitting(false);

			if (response.ok) {
				setSubmissionSuccess(true);
				setFormInput({
					name: "",
					email: "",
					message: "",
				});
			} else {
				setSubmissionError(true);
			}
		} catch (error) {
			setIsSubmitting(false);
			setSubmissionError(true);
		}
	};

	return (
		<div className='container Contact'>
			<h1>Contact</h1>
			<div className='blurb'>
				If you have any questions, issues, or requests, contact us at the form below or email us at
				<a href="mailto:support@piagetbot.com">support@piagetbot.com</a>
				<br />
			</div>
			{!submissionSuccess ? (
				<form onSubmit={handleSubmit}>
					<TextField
						InputLabelProps={{
							sx: { "&.Mui-focused": { color: "#000" } },
						}}
						sx={{
							"&& .Mui-focused .MuiOutlinedInput-notchedOutline": {
								border: "1px solid #111",
							},
						}}
						name='name'
						label='Name'
						variant='outlined'
						fullWidth
						error={submissionError}
						margin='normal'
						value={formInput.name}
						onChange={handleInputChange}
						required
					/>
					<TextField
						InputLabelProps={{
							sx: { "&.Mui-focused": { color: "#000" } },
						}}
						sx={{
							"&& .Mui-focused .MuiOutlinedInput-notchedOutline": {
								border: "1px solid #111",
							},
						}}
						name='email'
						label='Email'
						variant='outlined'
						fullWidth
						error={submissionError}
						margin='normal'
						value={formInput.email}
						onChange={handleInputChange}
						required
					/>
					<TextField
						InputLabelProps={{
							sx: { "&.Mui-focused": { color: "#000" } },
						}}
						sx={{
							"&& .Mui-focused .MuiOutlinedInput-notchedOutline": {
								border: "1px solid #111",
							},
						}}
						name='message'
						label='Message'
						variant='outlined'
						fullWidth
						error={submissionError}
						margin='normal'
						multiline
						rows={5}
						value={formInput.message}
						onChange={handleInputChange}
						required
					/>
					{isSubmitting ? <CircularProgress size={20} /> : <button type='submit'>Submit</button>}

					{submissionError && (
						<div style={{fontSize:"1.4em"}} >
							There was an error submitting the form. Please try again later or email us
							directly at <a href="mailto:support@piagetbot.com">support@piagetbot.com</a>
						</div>
					)}
				</form>
			) : (
				<div>
					<img src={CheckCircleOutlineIcon} />
					<div style={{fontSize:"1.4em"}} >
						Thank you for your message!
					</div>
				</div>
			)}
		</div>
	);
}

export default Contact;
