import React, {useEffect, useState} from 'react';

function orderText(n: number): string {
    const suffix = ["th", "st", "nd", "rd", "th"][Math.min(n % 10, 4)];
    if (11 <= (n % 100) && (n % 100) <= 13) {
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
  
  const UpDownSelector = ({ targetReadability, setTargetReadability }: {targetReadability: number,
    setTargetReadability: Function}) => {

    const onUp = () => {
        if (targetReadability < 17) {
            setTargetReadability(targetReadability + 1);
        }
    }
    const onDown = () => {
        if (targetReadability > 0) {
        setTargetReadability(targetReadability - 1);
        }
    }
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          onUp();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          onDown();
        }
      };
    return (
        <div className="up-down-selector" onKeyDown={handleKeyDown} tabIndex={0}>
        <button className="triangle-button" onClick={onUp}>
          <svg width="15" height="10" viewBox="0 0 15 10">
            <path d="M0,10 L7.5,0 L15,10 Z" fill="currentColor" />
          </svg>
        </button>
        <button className="triangle-button" onClick={onDown}>
          <svg width="15" height="10" viewBox="0 0 15 10">
            <path d="M0,0 L7.5,10 L15,0 Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    );
  };
  


function InfoBar ({currentReadability, targetReadability, setTargetReadability} : {currentReadability: string, targetReadability : number, setTargetReadability : Function}) {

    const plainLangTarget = plainLanguageDifficulty(targetReadability);
	let plainLangTargetString = ""
    if (targetReadability < 17) {
        plainLangTargetString = plainLangTarget[1] + ", " + plainLangTarget[0];
    } else {
        plainLangTargetString = plainLangTarget[1];
    }


    return (

				<div className="infoBar">
					<span className="infoBarText">
						<span>Current difficulty:{"  "}</span>
						<span>{currentReadability}</span>
					</span>
					<span className="infoBarText">
						<span>Target difficulty:{"  "}</span>
						<span>{plainLangTargetString}</span>
                        <UpDownSelector targetReadability={targetReadability} setTargetReadability={setTargetReadability}/>
					</span>


				</div>

    )
}

export default InfoBar;