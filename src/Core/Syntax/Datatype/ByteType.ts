import * as module_numbertype from './NumberType';
import * as exception_conversionerror from '../../SError/ConversionErrorException';
import * as interface_types from './TypeInterface';

export namespace Core.Syntax.Datatype {
	export class ByteType implements interface_types.Core.Syntax.Datatype.TypesInterface {
		public dataTypeName: string = 'Byte';
		public multipliers: { [key: string]: number } = {
			p: 1e-12,
			B: 1,
			KB: 1e3,
			MB: 1e6,
			GB: 1e9,
			TB: 1e12,
			PB: 1e15,
			EB: 1e18,
			ZB: 1e21,
			YB: 1e24,
		};
		private value: any;
		private NumberType: module_numbertype.Core.Syntax.Datatype.NumberType;
		private pattern: RegExp;

		constructor() {
			this.NumberType = new module_numbertype.Core.Syntax.Datatype.NumberType;
			this.pattern = new RegExp(/^(((\d+(\.\d+)?)([YZEPTGMKBp]*)|0x[0-9A-Fa-f]+|0b[01]+)(\W|\s){0,}?){0,}$/);
		}

		public setValue(value: string) {
			this.value = value;

			return this;
		}

		public getValue() {
			return this.value;
		}

		public is() {
			return this.pattern.test(this.value);
		}

		public convertTo() {
			if (!this.is()) {
				throw new Error((new exception_conversionerror.Core.SError.ConversionErrorException).on());
			}

			this.value = this.parseByteValue(this.value);
			this.value = this.parseHexValue(this.value);
			this.value = this.parseBinValue(this.value);

			return this;
		}

		public isValidByteValue(value: string) {
			var pattern = new RegExp(
				/^((\d+(\.\d+)?)([YZEPTGMKBp]*)(\W|\s){0,}?){0,}$/,
				'i'
			);

			return pattern.test(value);
		}

		public isValidHexValue(value: string) {
			var pattern = new RegExp(/^(0x[0-9A-Fa-f]+(\W|\s){0,}?){0,}$/);
			
			return pattern.test(value);
		}

		public isValidBinValue(value: string) {
			var pattern = RegExp(/^(0b[01]+(\W|\s){0,}?){0,}$/);

			return pattern.test(value);
		}

		public parseHexValue(value: string) {
			return value.replace(/0x[0-9A-Fa-f]+/g, (match) => {
				const hex = match;
				const decimal = parseInt(hex, 16);
				return decimal.toString();
			});
		}

		public parseBinValue(value: string) {
			return value.replace(/0b[01]+/g, (match) => {
				const binary = match;
				const decimal = parseInt(binary.slice(2), 2); // Remove '0b' prefix and parse as binary
				return decimal.toString();
			});
		}

		public parseByteValue(value: string) {
			return value.replace(/(\d+(\.\d+)?)([YZEPTGMKBp]*)/gi, (match, numericValue, decimal, unit) => {
				numericValue = parseFloat(numericValue);
				unit = unit.toUpperCase();
		
				let decimalValue: number | null = null;
				if (this.multipliers[unit]) {
					decimalValue = numericValue * this.multipliers[unit];
				}
				decimalValue = decimalValue ?? numericValue;
		
				if (decimalValue?.toString().includes('.')) {
					return decimalValue.toFixed();
				} else {
					return Math.round(decimalValue ?? 0).toString();
				}
			});
		}
	}
}