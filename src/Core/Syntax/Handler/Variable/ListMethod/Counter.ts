export namespace Core.Syntax.Handler.ListMethod {
	export class Counter {
		private value: string = '';
		private remainingOpenBracket: number | null = null;
		private bracketFindPattern: RegExp[] = [/((?<!\\\\)\[)/, /((?<!\\\\)\])/];

		public is(allVariableDetails: { [key: string]: any }) {
			if (allVariableDetails['datatype'].toLowerCase() == 'list') {
				return true;
			}

			return false;
		}

		public add(number: number = 1) {
			if (this.remainingOpenBracket != null) {
				this.remainingOpenBracket += number;
			}
		}

		public sub(number: number = 1) {
			if (this.remainingOpenBracket != null) {
				this.remainingOpenBracket -= number;

				if (this.remainingOpenBracket < 0) {
					this.remainingOpenBracket = 0;
				}
			}
		}

		public get() {
			return this.remainingOpenBracket;
		}

		public should(line: string) {
			if (this.remainingOpenBracket === null) {
				this.remainingOpenBracket = 0;
			}
		
			const openBracketMatches = line.match(this.bracketFindPattern[0]);
			if (openBracketMatches) {
				this.add(openBracketMatches.length);
			}
		
			const closeBracketMatches = line.match(this.bracketFindPattern[1]);
			if (closeBracketMatches) {
				this.sub(closeBracketMatches.length);
			}
		
			return this;
		}

		public able() {
			if (this.remainingOpenBracket === 0) {
				return true;
			}

			return false;
		}

		public storage(value: string) {
			this.value = this.value.concat(value);

			return this;
		}

		public getStorage() {
			return this.value.trim();
		}
	}
}