export namespace Core.SError { // S: Special
	export class Exception extends Error {
		protected global_message: string = "Unknown error";
		protected line: number = 0;

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? "Unknown error");
			this.line = line;
		}

		public setLineNumber(line: number): void {
			this.line = line;
		}

		public on(): string {
			return `Error on line ${this.line}: ${this.message}`;
		}
	}
}