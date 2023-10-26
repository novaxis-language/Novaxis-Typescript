import * as module_exception from './Exception';

export namespace Core.SError {
	export class InvalidValueException extends module_exception.Core.SError.Exception {
		public message: string = 'The provided value is empty or not valid for the specified data type.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'The provided value is empty or not valid for the specified data type.', line);
		}
	}
}