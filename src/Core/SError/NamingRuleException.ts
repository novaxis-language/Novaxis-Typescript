import * as module_exception from './Exception';

export namespace Core.SError {
	export class NamingRuleException extends module_exception.Core.SError.Exception {
		public message: string = 'The provided name violates the naming rules. Make sure the name follows the allowed format.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'The provided name violates the naming rules. Make sure the name follows the allowed format.', line);
		}
	}
}