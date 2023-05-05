import React, { useState } from "react";
import LessonStep from "./LessonStep";
import "./LessonStep.css";


interface LessonPlanRequest {
  subject: string;
  topic: string;
  gradeLevel: number;
  stateStandards: string | null;
  focusPoints: string | null;
  priorKnowledge: string | null;
  scaffoldingGoals: string | null;
  targetSkills: string | null;
}



//Between each step, add AI generation loading screen that ends when you've received the generations.
// Create automatic formatting, so that GPT can simply respond in plain text or numbered lists, and the formatting will be done automatically.
// Can be done in HTML just fine and then converted to PDF, though DOCX will be more difficult.

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