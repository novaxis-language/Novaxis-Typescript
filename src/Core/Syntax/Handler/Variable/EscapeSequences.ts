export namespace Core.Syntax.Handler.Variable {
	export class EscapeSequences {
		private backslashes: { [key: string]: string } = {
			"\\\\": "\\",
			"\\#": "#",
			"\\/": "/",
			"\\{": "{",
			"\\S": " "
		};

		public replaceEscapeSequences(input: string): string {
			if (typeof input === 'string') {
				return input.replace(/\\\\|\\[/#\S]/g, (match) => {
					return this.backslashes[match] || match;
				});
			}

			return input;
	 	}
	}
  }
  