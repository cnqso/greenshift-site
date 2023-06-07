import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import {XButton, Sun} from "./SVGs";
function orderText(n: number): string {
	const suffix = ["th", "st", "nd", "rd", "th"][Math.min(n % 10, 4)];
	if (11 <= n % 100 && n % 100 <= 13) {
		return n.toString() + "th";
	}
	return n.toString() + suffix;
}

function plainLanguageDifficulty(ARI: number): string[] {
	const plainLanguageARI: string[] = ["Kindergarten", "Elementary School"];
	const plainDifficulty: string = orderText(Math.floor(ARI));
	const fourYearNames: string[] = ["Freshman", "Sophomore", "Junior", "Senior"];

	if (ARI < 1) {
		plainLanguageARI[0] = "Kindergarten";
	} else if (ARI < 6) {
		plainLanguageARI[0] = `${plainDifficulty} Grade`;
		plainLanguageARI[1] = "Elementary School";
	} else if (ARI < 9) {
		plainLanguageARI[0] = `${plainDifficulty} Grade`;
		plainLanguageARI[1] = "Middle School";
	} else if (ARI < 13) {
		plainLanguageARI[0] = `${plainDifficulty} Grade`;
		plainLanguageARI[1] = "High School";
	} else if (ARI < 17) {
		plainLanguageARI[0] = `College ${fourYearNames[Math.floor(ARI) - 13]}`;
		plainLanguageARI[1] = "University";
	} else if (ARI < 25) {
		plainLanguageARI[0] = `${orderText(Math.floor(ARI - 16))} year grad student`;
		plainLanguageARI[1] = "Graduate School";
	} else {
		plainLanguageARI[0] = `${orderText(Math.floor(ARI - 16))} year grad student`;
		plainLanguageARI[1] = "Impenetrable";
	}

	return plainLanguageARI;
}

const MaterialUISwitch = styled(Switch)(({ theme }:{theme: any}) => ({
	width: 62,
	height: 34,
	padding: 7,
	"& .MuiSwitch-switchBase": {
		margin: 1,
		padding: 0,
		transform: "translateX(6px)",
		"&.Mui-checked": {
			color: "#fff",
			transform: "translateX(22px)",
			"& .MuiSwitch-thumb:before": {
				backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 24 24"><path fill="%23fff" d="M11 6.999c2.395.731 4.27 2.607 4.999 5.001.733-2.395 2.608-4.269 5.001-5-2.393-.731-4.268-2.605-5.001-5-.729 2.394-2.604 4.268-4.999 4.999zm7 7c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm-6 5.501c1.198.365 2.135 1.303 2.499 2.5.366-1.198 1.304-2.135 2.501-2.5-1.197-.366-2.134-1.302-2.501-2.5-.364 1.197-1.301 2.134-2.499 2.5zm-6.001-12.5c-.875 2.873-3.128 5.125-5.999 6.001 2.876.88 5.124 3.128 6.004 6.004.875-2.874 3.128-5.124 5.996-6.004-2.868-.874-5.121-3.127-6.001-6.001z"/></svg>')`,
			},
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
			},
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
		width: 32,
		height: 32,
		"&:before": {
			content: "''",
			position: "absolute",
			width: "100%",
			height: "100%",
			left: 0,
			top: 0,
			backgroundRepeat: "no-repeat",
			backgroundPosition: "center",
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="%23fff" d="M8 24l3-9h-9l14-15-3 9h9l-14 15z"/></svg>')`,
		},
	},
	"& .MuiSwitch-track": {
		opacity: 1,
		backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
		borderRadius: 20 / 2,
	},
}));


export {orderText, plainLanguageDifficulty, MaterialUISwitch}