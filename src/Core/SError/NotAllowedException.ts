import * as module_exception from './Exception';

export namespace Core.SError {
	export class NotAllowedException extends module_exception.Core.SError.Exception {
		public message: string = 'Adding a new item is not allowed.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'Adding a new item is not allowed.', line);
		}
	}
}