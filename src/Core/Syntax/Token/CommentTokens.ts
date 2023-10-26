export namespace Core.Syntax.Token {
	export class CommentTokens {
		public static COMMENT_DECLARE: string[] = ['#', '//'];
		public static MULTI_LINES_COMMENT_OPEN: string[] = ['/*'];
		public static MULTI_LINES_COMMENT_CLOSE: string[] = ['*/'];
	}
}