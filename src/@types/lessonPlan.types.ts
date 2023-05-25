export interface LessonPlanSpec {
	subject: string;
	topic: string;
	gradeLevel: number;
	stateStandards: string | null;
	focusPoints: string | null;
	priorKnowledge: string | null;
	scaffoldingGoals: string | null;
	targetSkills: string | null;
}
export interface LessonPlan {
	specification: LessonPlanSpec;
	swbat: string;
	assessments: string;
	activities: string;
	materials: Materials | null;
}

export interface Materials {
	TBD: string | null;
}