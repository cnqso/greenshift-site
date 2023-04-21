/** @format */

export interface ListItems {
	[key: number]: {
		selection: { label: string; value: string };
		quant: number;
	};
}

export interface GenerationRequest {
	type: string;
	quantity: string;
}
