import * as module_exception from './Exception';

export namespace Core.SError {
	export class MissingInheritanceException extends module_exception.Core.SError.Exception {
		public message: string = 'The datatype does not have a valid inheritance. Please make sure to specify a valid parent datatype for the datatype.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'The datatype does not have a valid inheritance. Please make sure to specify a valid parent datatype for the datatype.', line);
		}
	}
}