import * as exception_namingrule from '../../SError/NamingRuleException';

export namespace Core.Syntax.Handler {
	export class Namingrules {
		private pattern: RegExp = /^[a-zA-Z0-9_]*$/;
		private fix_pattern: RegExp = /[^a-zA-Z0-9_]/g;
		private regexPattern: RegExp;

		constructor() {
			this.regexPattern = new RegExp(this.pattern);
		}

		public isValid(input: string, throwException: boolean = false): boolean {
			var regexResult = this.regexPattern.test(input);
			var result = regexResult && input.trim() !== '';
	  
			if (throwException && !result) {
				throw new Error((new exception_namingrule.Core.SError.NamingRuleException).on());
			}
	  
			return result;
		}

		public fix(input: string) {
			const cleanedInput = input.replace(this.fix_pattern, '');

	  		// if (cleanedInput.length > 0 && !/[a-zA-Z_]/.test(cleanedInput[0])) {
			// 	return '_' + cleanedInput;
	  		// }
		
	  		return cleanedInput;
		}
	}
}