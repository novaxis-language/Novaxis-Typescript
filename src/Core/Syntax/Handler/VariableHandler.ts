import * as exception_invalidvalue from '../../SError/InvalidValueException';
import * as module_namingrules from './Namingrules';
import * as module_variabletokens from '../Token/VariableTokens';

export namespace Core.Syntax.Handler {
	export class VariableHandler {
		public pattern: RegExp;
		private Namingrules: module_namingrules.Core.Syntax.Handler.Namingrules;
		private VISIBILITY_KEYWORDS: { [key: string]: string };

		constructor() {
			this.Namingrules = new module_namingrules.Core.Syntax.Handler.Namingrules;
			this.VISIBILITY_KEYWORDS = module_variabletokens.Core.Syntax.Token.VariableTokens.VISIBILITY_KEYWORDS;

			// const values = Object.values(this.VISIBILITY_KEYWORDS).map(value => {
			// 	return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
			// });
		
			this.pattern = new RegExp(
				/^\s*(Public|Private|Protected|Inherited|Restricted)?\s*([A-z0-9_]*)\s*((\?)\s*(.*?)\s*(\((\w|\W){0,}\))?)?\s*(=|:)\s*.+\s*$/,
				'i'
			);
		}

		public isVariable(line: string): boolean {
			if (this.pattern.test(line) && this.isValidVariableVisibilitySyntax(line, null) && this.getVariableName(line, true)) {
				return true;
			}

			return false;
		}

		public isValidVariableVisibilitySyntax(line: string | null = null, value: string | null = null): boolean {
			if (line && this.pattern.test(line)) {
				const matches = line.match(this.pattern);
	  
				if (matches && matches[1] && !(Object.keys(this.VISIBILITY_KEYWORDS)).includes(matches[1].toLowerCase())) {
					return false;
				}
			} else if (value && !(Object.keys(this.VISIBILITY_KEYWORDS)).includes(value.toLowerCase())) {
				return false;
			}
	  
			return true;
		}

		public getVariableVisibilitySyntax(line: string): string {
			if (this.pattern.test(line)) {
				const matches = line.match(this.pattern);
	  
				if (matches && matches[1]) {
					var visibilityKeyword = matches[1].toLowerCase().trim();
					return this.VISIBILITY_KEYWORDS[visibilityKeyword] || this.VISIBILITY_KEYWORDS['public'];
				}
			}
	  
			return this.VISIBILITY_KEYWORDS['public'];
		}

		public getVariableName(line: string, throwException: boolean = true): string | null {
			if (this.pattern.test(line)) {
				const matches = line.match(this.pattern);
	  
				if (matches && matches[2]) {
					const variableName = matches[2].trim();
	  
					if (!this.Namingrules.isValid(variableName, throwException) && !throwException) {
						return null;
					}
	  
					return variableName;
				}
			}
	  
			return null;
		}

		public getVariableValue(line: string): string {
			const pattern = /(?:\=|\:)\s*(.*?)$/;
			const matches = line.match(pattern);

			if (matches) {
				if (matches[1].trim() === '') {
					throw new Error((new exception_invalidvalue.Core.SError.InvalidValueException).on());
				}

				return matches[1].trim();
			}

			throw new Error((new exception_invalidvalue.Core.SError.InvalidValueException).on());
		}

		public getVariableDatatype(line: string): string | null {
			const pattern = /\?\s*(.*?)(?:=|;|:|$)/;
			const matches = line.match(pattern);
	  
			if (matches && matches[1]) {
				return matches[1].trim();
			}
	  
			return null;
		}

		public getAllVariableDetails(line: string): {
			visibility: string,
			name: string | null,
			datatype: string | null,
			value: string | null
		} {
			return {
				visibility: this.getVariableVisibilitySyntax(line),
				name: this.getVariableName(line),
				datatype: this.getVariableDatatype(line),
				value: this.getVariableValue(line)
			};
		}
	}
}