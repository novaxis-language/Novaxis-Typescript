import * as module_comment from '../Token/CommentTokens';

export namespace Core.Handler {
	export class CommentHandler {
		private pattern: RegExp;
			
		constructor() {
			const escapedCharacters = module_comment.Core.Syntax.Token.CommentTokens.COMMENT_DECLARE.map((char: string) => {
				return (char === "//") ? char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : char;
			});

			const regex = escapedCharacters.join('|');
			this.pattern = new RegExp(`(?<!\\\\)\\s*(?:${regex})`);
		}

		public is(line: string): boolean {
			return this.pattern.test(line) ? true : false;
		}

		public split(line: string) {
			var pattern = new RegExp(`^(.*?)${String(this.pattern).slice(1, -1)}`);
			var matches = line.match(pattern);
	
			if (typeof matches === 'object' && matches != null) {
				return matches[1] !== undefined ? matches[1] : line;
			}
		}
	}
}