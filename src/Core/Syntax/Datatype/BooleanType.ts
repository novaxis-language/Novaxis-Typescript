import * as interface_type from './TypeInterface';
import * as exception_conversionerror from '../../SError/ConversionErrorException';

export namespace Core.Syntax.Datatype {
	export class BooleanType implements interface_type.Core.Syntax.Datatype.TypesInterface {
		public dataTypeName: string = 'Boolean';
		private value: any;
		private booleanValues: { [key: string]: [string, string] } = {
			true: ['true', '1'],
			false: ['false', '0']
		};

		constructor() {}

		public setValue(input: string) {
			this.value = input.toLowerCase();

			return this;
		}

		public getValue() {
			return this.value;
		}

		public is() {
			var result: string | boolean | null = null;
			Object.keys(this.booleanValues).forEach(keyname => {
				if (this.booleanValues[keyname].includes(this.value)) {
					result = 'true';
					// return;
				}
			});

			result = result == null ? false : true;

			return result;
		}

		public convertTo() {
			if (!this.is()) {
				throw new Error((new exception_conversionerror.Core.SError.ConversionErrorException).on());
			}

			Object.keys(this.booleanValues).forEach(keyname  => {
				if (this.booleanValues[keyname].includes(this.value)) {
					// this.value = Boolean(JSON.stringify(keyname == 'true' ? true : false));
					this.value = JSON.stringify(keyname == 'true' ? true : false);
				}
			});

			return this;
		}
	}
}