export function timeAgo(input) {
	const date = input instanceof Date ? input : new Date(input);
	const formatter = new Intl.RelativeTimeFormat("en");
	const ranges = {
		years: 3600 * 24 * 365,
		months: 3600 * 24 * 30,
		weeks: 3600 * 24 * 7,
		days: 3600 * 24,
		hours: 3600,
		minutes: 60,
		seconds: 1,
	};
	const secondsElapsed = (date.getTime() - Date.now()) / 1000;
	for (const key in ranges) {
		if (ranges[key] < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / ranges[key];
			return formatter.format(Math.round(delta), key);
		}
	}
}
export function validateUsername(value) {
	return value.match(/^[a-z]+(?:_+[a-z]+)*$/);
}
export function validateEmail(email) {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	);
}
export function validatePassword(password) {
	return password.match(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
	);
}
// in case of any particular use-case

export function hasEightDigit(text) {
	return text.length >= 8;
}
export function hasNumber(text) {
	return text.match(/[0-9]/);
}
export function hasUpperCase(text) {
	return text.match(/[A-Z]/);
}
export function hasSpecialCharacter(text) {
	return text.match(/\W/);
}
export function hasWhiteSpace(text) {
	return text.match(/\s/g);
}
export function checkPassword(text) {
	const isLength = hasEightDigit(text);
	const isNumber = hasNumber(text);
	const isUpperCase = hasUpperCase(text);
	const isSpecialCharacter = hasSpecialCharacter(text);
	const isWhiteSpace = hasWhiteSpace(text);

	let temp = {};
	if (
		isLength &&
		isNumber &&
		isUpperCase &&
		isSpecialCharacter &&
		!isWhiteSpace
	) {
		temp = { validate: true };
	} else {
		for (let i = 0; i < 5; i++) {
			temp = {
				validate: false,
				message: `Password must ${
					!isLength || !isNumber || !isUpperCase || !isSpecialCharacter
						? "include"
						: "not have"
				} ${isLength ? "" : "8 characters"}${
					!isLength && !isNumber ? ", " : ""
				} ${isNumber ? "" : "one digit"}${
					!isNumber && !isUpperCase ? ", " : ""
				}${isUpperCase ? "" : "one uppercase character"} 
				${!isUpperCase && !isSpecialCharacter ? ", " : ""}
				${isSpecialCharacter ? "" : "one special character"}
				${!isSpecialCharacter && isWhiteSpace ? ", " : ""}
				${
					!isWhiteSpace
						? ""
						: isLength && isNumber && isUpperCase && isSpecialCharacter
						? "whitespace"
						: "and exclude whitespace"
				}.`,
			};
		}
	}

	return temp;
}
export function validateName(value) {
	return value.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
}
