import * as module_exception from './Exception';

export namespace Core.SError {
	export class ConversionErrorException extends module_exception.Core.SError.Exception {
		public message: string = 'An error occurred while converting the value to the desired datatype. Please check that the provided value is compatible with the specified datatype.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'An error occurred while converting the value to the desired datatype. Please check that the provided value is compatible with the specified datatype.', line);
		}
	}
}