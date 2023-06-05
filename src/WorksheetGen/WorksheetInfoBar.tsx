/** @format */

import React, { useEffect, useState } from "react";


import UpDownSelector from "../assets/UpDownSelector";
import { orderText, plainLanguageDifficulty, MaterialUISwitch } from "../assets/utilities";

function WorksheetInfoBar({
	premiumModel,
	setPremiumModel,
	gradeLevel,
	setGradeLevel,
}: {
	premiumModel: boolean;
	setPremiumModel: Function;
	gradeLevel: number;
	setGradeLevel: Function;
}) {
	const plainLangTarget = plainLanguageDifficulty(gradeLevel);
	let plainLangTargetString = "";
	if (gradeLevel < 17) {
		plainLangTargetString = plainLangTarget[1] + ", " + plainLangTarget[0];
	} else {
		plainLangTargetString = plainLangTarget[1];
	}

	function handleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
		setPremiumModel(event.target.checked);
	}

	return (
		<div className='infoBar'>
			<span className='infoBarText'>
			<MaterialUISwitch checked={premiumModel} onChange={handleSwitch} sx={{ m: 1 }} /><span>{premiumModel ? "Premium Model" : "Basic Model"}</span>

			</span>

			<span className='infoBarText'>
				<span>Grade Level:{"  "}</span>
				<span>{plainLangTargetString}</span>
				<UpDownSelector value={gradeLevel} setValue={setGradeLevel} />
			</span>
		</div>
	);
}

export default WorksheetInfoBar;
