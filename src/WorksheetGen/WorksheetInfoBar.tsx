/** @format */

import React, { useEffect, useState } from "react";


import UpDownSelector from "../assets/UpDownSelector";
import { orderText, plainLanguageDifficulty, MaterialUISwitch } from "../assets/utilities";

function WorksheetInfoBar({
	premiumModel,
	setPremiumModel,
	gradeLevel,
	setGradeLevel,
	setError,
}: {
	premiumModel: boolean;
	setPremiumModel: Function;
	gradeLevel: number;
	setGradeLevel: Function;
	setError: any;
}) {
	const plainLangTarget = plainLanguageDifficulty(gradeLevel);
	let plainLangTargetString = "";
	if (gradeLevel < 13) {
		plainLangTargetString = plainLangTarget[0];
	} else if (gradeLevel < 17) {
		plainLangTargetString = "Undergraduate " + (gradeLevel-12).toString();
	} else {
		plainLangTargetString = plainLangTarget[1];
	}

	function handleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
		setPremiumModel(setError, event.target.checked);
	}

	return (


		<div className='infoBar worksheetInfoBar' style={{alignItems: "center"}}>
			<span className='infoBarText leftInfo'>
			<span style={{maxWidth: "50px", maxHeight:"50px"}}>
			<MaterialUISwitch checked={premiumModel} onChange={handleSwitch} sx={{ m: 1 }} />
			</span>
			</span>
			<span className='infoBarText'>
				
				<span style={{whiteSpace: "nowrap"}}>{"   "}</span>
			</span>

			<span className='infoBarText rightInfo'>
				<span>Grade Level:{"  "}</span>
				<span className="infoBarLevelAdjust">{plainLangTargetString}
				<UpDownSelector value={gradeLevel} setValue={setGradeLevel} />
			</span></span>
		</div>
	);
}

export default WorksheetInfoBar;
