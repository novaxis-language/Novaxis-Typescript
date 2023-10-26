import * as module_exception from './Exception';

export namespace Core.SError {
	export class InvalidVariableVisibilitySyntaxException extends module_exception.Core.SError.Exception {
		public message: string = 'Invalid visibility of the variable syntax.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'Invalid visibility of the variable syntax.', line);
		}
	}
}