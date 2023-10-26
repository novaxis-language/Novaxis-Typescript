import * as module_exception from './Exception';

export namespace Core.SError {
	export class InterpolationPathNotFoundException extends module_exception.Core.SError.Exception {
		public message: string = 'The specified path does not exist in the data structure.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'The specified path does not exist in the data structure.', line);
		}
	}
}