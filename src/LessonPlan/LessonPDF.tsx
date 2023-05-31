/** @format */

import React from "react";
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Font,
	PDFViewer,
	PDFDownloadLink,
} from "@react-pdf/renderer";
import { LessonPlan } from "../@types/lessonPlan.types";


const styles = StyleSheet.create({
	body: {
		paddingTop: 35,
		paddingBottom: 65,
		paddingHorizontal: 35,
		display: "flex",
		fontFamily: "Times-Roman",
	},
	twoColumn: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		width: "100%",
	},
	oneColumn: {
		width: "100%",
	},
	title: {
		fontSize: 27,
		textAlign: "center",
	},
	author: {
		marginTop: 5,
		fontSize: 15,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 18,
		margin: 6,
		textAlign: "center",
	},
	text: {
		margin: 12,
		fontSize: 14,
		textAlign: "justify",
	},
	header: {
		fontSize: 12,
		marginBottom: 20,
		textAlign: "center",
		color: "grey",
	},
	pageNumber: {
		position: "absolute",
		fontSize: 12,
		bottom: 30,
		left: 0,
		right: 0,
		textAlign: "center",
		color: "grey",
	},
});

function orderText(n: number): string {
	const suffix = ["th", "st", "nd", "rd", "th"][Math.min(n % 10, 4)];
	if (11 <= n % 100 && n % 100 <= 13) {
		return n.toString() + "th";
	}
	return n.toString() + suffix;
}

// Create Document Component
export default function LessonPDF({ outputText }: { outputText: LessonPlan }) {
	const { activities, assessments, materials, specification, swbat } = outputText;
	const {
		focusPoints,
		gradeLevel,
		priorKnowledge,
		scaffoldingGoals,
		stateStandards,
		subject,
		targetSkills,
		topic,
	} = specification;


	const nameOfClass = orderText(gradeLevel) + " Grade " + subject;

	return (
		<PDFViewer className='pdfViewer'>
			<Document>
				<Page style={styles.body}>
					{/* <Text style={styles.header} fixed></Text> */}
					<Text style={styles.title}>{topic}</Text>
					<View wrap={false} style={styles.oneColumn}>
						<Text style={styles.author}>{nameOfClass}</Text>
					</View>

					<View wrap={false} style={styles.twoColumn}>
						<View style={styles.oneColumn}>
							<Text style={styles.subtitle}>Objectives</Text>
							<Text style={styles.text}>{swbat}</Text>
						</View>
						<View style={styles.oneColumn}>
							<Text style={styles.subtitle}>Materials</Text>
							<Text style={styles.text}>{materials}</Text>
						</View>
					</View>
					<View wrap={true} style={styles.oneColumn}>
						<Text style={styles.subtitle}>Procedure</Text>
						<Text style={styles.text}>{activities}</Text>
					</View>
					<View wrap={false} style={styles.oneColumn}>
						<Text style={styles.subtitle}>Assessment</Text>
						<Text style={styles.text}>{assessments}</Text>
					</View>
					<Text
						style={styles.pageNumber}
						render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
						fixed
					/>
				</Page>
			</Document>
		</PDFViewer>
	);
}
