import * as module_exception from './Exception';

export namespace Core.SError {
	export class AutotypeConversionException extends module_exception.Core.SError.Exception {
		public message: string = 'Autotype conversion failed. No suitable datatype found to convert the value.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'Autotype conversion failed. No suitable datatype found to convert the value.', line);
		}
	}
}