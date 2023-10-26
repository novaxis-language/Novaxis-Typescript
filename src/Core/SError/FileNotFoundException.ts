import * as module_exception from './Exception';

export namespace Core.SError {
	export class FileNotFoundException extends module_exception.Core.SError.Exception {
		public message: string = 'The specified file could not be located or accessed.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'The specified file could not be located or accessed.', line);
		}
	}
}