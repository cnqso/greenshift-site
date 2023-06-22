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
  setError,
}: {
	currentReadability: string;
	targetReadability: number;
	setTargetReadability: Function;
  premiumModel: boolean;
  setPremiumModel: Function;
  setError: any;
}) {
	const plainLangTarget = plainLanguageDifficulty(targetReadability);
	let plainLangTargetString = "";
	if (targetReadability < 13) {
		plainLangTargetString = plainLangTarget[0];
	} else if (targetReadability < 17) {
		plainLangTargetString = "Undergraduate " + (targetReadability-12).toString();
	} else {
		plainLangTargetString = plainLangTarget[1];
	}

  function handleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
    setPremiumModel(setError, event.target.checked);
  }
  
	return (
		<div className='infoBar' style={{alignItems: "center"}}>
      			<span className='infoBarText leftInfo'>
				<span style={{maxWidth: "50px", maxHeight:"50px"}}>
			<MaterialUISwitch checked={premiumModel} onChange={handleSwitch} sx={{ m: 1 }} />
			</span>
			</span>
			<span className='infoBarText'>
				<div>Current level:{"  "}</div>
				<span style={{whiteSpace: "nowrap"}}>{currentReadability.length > 15 ? currentReadability.slice(0, 16) : currentReadability}</span>
			</span>

			<span className='infoBarText rightInfo'>
				<div >Target level:{"  "}</div>
				<span className="infoBarLevelAdjust">{plainLangTargetString}
				<UpDownSelector
					value={targetReadability}
					setValue={setTargetReadability}
				/></span>
			</span>
		</div>
	);
}

export default InfoBar;
