export interface UserInfo {
	username: string;
	email: string;
	sub: string;
}

export interface UserPreferences {
	credits: number;
	subscription: string;
	subscription_expiration: string;
	stripeId: string;
}

export interface DatabaseInfo {
	preferences: {
		S: string;
	};
	UserId: {
		S: string;
	};
}

export interface Generations {
	[key: string]: { [S: string]: string };
}

export interface InputData {
	user_claims: UserInfo;
	databaseInfo: DatabaseInfo;
}



export interface UserClaims {
	sub: string;
	email_verified: boolean;
	iss: string;
	"cognito:username": string;
	origin_jti: string;
	aud: string;
	event_id: string;
	token_use: string;
	auth_time: number;
	exp: number;
	iat: number;
	jti: string;
	email: string;
}

export interface DatabaseInfo {
	preferences: {
		S: string;
	};
	UserId: {
		S: string;
	};
}
