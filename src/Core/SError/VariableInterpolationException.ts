import * as module_exception from './Exception';

export namespace Core.SError {
	export class VariableInterpolationException extends module_exception.Core.SError.Exception {
		public message: string = 'Variable interpolation is not allowed due to variable visibility.';

		constructor(message: string | null = null, line: number = 0) {
			super(message ?? 'Variable interpolation is not allowed due to variable visibility.', line);
		}
	}
}