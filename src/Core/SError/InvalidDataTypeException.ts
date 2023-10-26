import * as module_exception from './Exception';

export namespace Core.SError {
	export class InvalidDataTypeException extends module_exception.Core.SError.Exception {
		public message: string = 'Invalid or unsupported data type. Please enter a valid data type.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'Invalid or unsupported data type. Please enter a valid data type.', line);
		}
	}
}