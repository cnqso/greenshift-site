/** @format */

import React from "react";
import RichText from "./RichText";
import "./Readability.css";

const Readability = ({sendToCluod}: {sendToCluod: Function}) => {
	return <RichText sendToCluod={sendToCluod}/>;
};

export default Readability;
