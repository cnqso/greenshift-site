import React, { useState } from "react";
import LessonStep from "./LessonStep";

const LessonPlan = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="lesson-plan-generator">
      <h1>Lesson Plan Generator</h1>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(currentStep - 1) * 20}%` }}></div>
      </div>
      <LessonStep step={currentStep} nextStep={nextStep} prevStep={prevStep} />
      <div className="step-navigation">
        {currentStep > 1 && (
          <button className="prev-button" onClick={prevStep}>
            Previous Step
          </button>
        )}
        {currentStep < 5 && (
          <button className="next-button" onClick={nextStep}>
            Next Step
          </button>
        )}
        {currentStep === 5 && (
          <button className="finish-button" onClick={() => alert("Lesson Plan Created!")}>
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonPlan;