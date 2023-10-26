import * as module_namingrules from './Namingrules';

export namespace Core.Handler {
	export class ClassHandler {
		private pattern: RegExp;
		private patternClassbox: RegExp;
		private patternMaximumNumber: RegExp;
		private Namingrules: module_namingrules.Core.Syntax.Handler.Namingrules;

		constructor() {
			this.Namingrules = new module_namingrules.Core.Syntax.Handler.Namingrules;
			this.pattern = new RegExp(/^\s*([^=\s:->]+)\s*(?:\?\s*([^=:\n]*?(?:\([^)]*\))?(?:\s+[^=:\n]*?(?:\([^)]*\))?)*))?\s*(?:->\s*(\d+|(\{(\w|\W){0,}\})))?\s*$/);
			this.patternClassbox = new RegExp(/^\s*\?\s*((\w|\W){0,})\s*$/);
			this.patternMaximumNumber = new RegExp(/\s*->\s*(\d+|(\{(\w|\W){0,}\}))\s*$/);
		}

		public isClass(input: string) {
			return this.pattern.test(input) ? true : false;
		}

		public isClassBox(input: string) {
			return this.patternClassbox.test(input) ? true : false;
		}

		public getClassBox(input: string) {
			var matches = input.match(this.patternClassbox);

			if (typeof matches == 'object' && matches !== null) {
				return matches[1].trim();
			}
		}

		public getClassName(input: string) {
			var matches = input.match(this.pattern);

			if (typeof matches == 'object' && matches !== null) {
				this.Namingrules.isValid(matches[1], true);
				
				return matches[1];
			}

			return null;
		}

		public getClassDatatype(input: string) {
			var matches = input.match(this.pattern);

			if (typeof matches == 'object' && matches !== null) {
				return matches[2] ?? null;
			}

			return null;
		}

		public getMaximumNumber(input: string) {
			var matches = input.match(this.patternMaximumNumber);

			if (typeof matches == 'object' && matches !== null) {
				return matches[1] ?? '';
			}

			return '';
		}

		public hasMaximumNumber(input: string) {
			return this.patternMaximumNumber.test(input) ? true : false;
		}
	}
}