import * as interface_types from './TypeInterface';
import * as exception_conversionerror from '../../SError/ConversionErrorException';

export namespace Core.Syntax.Datatype {
	export class StringType implements interface_types.Core.Syntax.Datatype.TypesInterface {
		public dataTypeName: string = 'String';
		private value!: string;
		
		constructor() {}

		public setValue(input: string) {
			this.value = input;

			return this;
		}

		public getValue() {
			return this.value;
		}

		public is() {
			return typeof this.value == 'string';
		}

		public convertTo() {
			if (!this.is()) {
				throw new Error((new exception_conversionerror.Core.SError.ConversionErrorException).on());
			}

			this.value = this.value.toString();

			return this;
		}
	}
}