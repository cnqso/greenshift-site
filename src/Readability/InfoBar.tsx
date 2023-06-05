/** @format */

import React, { useEffect, useState } from "react";
import {orderText, plainLanguageDifficulty} from "../assets/utilities";
import UpDownSelector from "../assets/UpDownSelector";
import { MaterialUISwitch } from "../assets/utilities";

function InfoBar({
	currentReadability,
	targetReadability,
	setTargetReadability,
  premiumModel,
  setPremiumModel,
}: {
	currentReadability: string;
	targetReadability: number;
	setTargetReadability: Function;
  premiumModel: boolean;
  setPremiumModel: Function;
}) {
	const plainLangTarget = plainLanguageDifficulty(targetReadability);
	let plainLangTargetString = "";
	if (targetReadability < 17) {
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
				<span>Current difficulty:{"  "}</span>
				<span>{currentReadability}</span>
			</span>

			<span className='infoBarText'>
				<span>Target difficulty:{"  "}</span>
				<span>{plainLangTargetString}</span>
				<UpDownSelector
					value={targetReadability}
					setValue={setTargetReadability}
				/>
			</span>
		</div>
	);
}

export default InfoBar;
