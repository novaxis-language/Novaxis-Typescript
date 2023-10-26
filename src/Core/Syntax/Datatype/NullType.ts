import * as exception_conversionerror from '../../SError/ConversionErrorException';
import * as interface_types from './TypeInterface';

export namespace Core.Syntax.Datatype {
	export class NullType implements interface_types.Core.Syntax.Datatype.TypesInterface {
		public dataTypeName: string = 'Null';
		private nullValues: string[] = ['none', 'null'];
		private value: string | null = '';

		constructor() {}

		public setValue(input: string) {
			this.value = input;

			return this;
		}

		public getValue() {
			return this.value;
		}

		public is() {
			return this.nullValues.includes(typeof this.value == 'string' ? this.value.toLowerCase() : '');
		}

		public convertTo() {
			if (this.is()) {
				this.value = JSON.stringify(null);
				return this;
			}
			else {
				throw new Error((new exception_conversionerror.Core.SError.ConversionErrorException).on());
			}

			return this;
		}
	}
}