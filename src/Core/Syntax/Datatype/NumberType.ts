import * as exception_conversionerror from '../../SError/ConversionErrorException';
import { create, all } from "mathjs";
import * as interface_types from './TypeInterface';

export namespace Core.Syntax.Datatype {
	export class NumberType implements interface_types.Core.Syntax.Datatype.TypesInterface {
		public dataTypeName: string = 'Number';
		private value: any;
		private math: any;

		constructor() {
			this.math = create(all);
		}

		public setValue(input: string) {
			this.value = input;

			return this;
		}

		public getValue() {
			return this.value;
		}

		public is() {
			if (typeof this.value == 'string') {
				this.value = this.value.toLowerCase();
			}

			if (typeof this.value == 'number' || this.isMathematicalOperation() || typeof this.value == 'boolean') {
				return true;
			}

			return false;
		}

		public isMathematicalOperation(input: string | null = null): boolean {
			try {
				if (input) {
					input = input.toLowerCase();
				}
				else if (typeof this.value == 'string') {
					input = this.value.toLowerCase();
				}
				
				this.math.compile(input ?? '').evaluate();
				return true;
			} catch (e) {
				return false;
			}

			return true;
		}

		public calculateResult(input: string | null = null) {
			if (input) {
				input = input.toLowerCase();
			}
			else if (this.value) {
				input = this.value.toString().toLowerCase();
			}

			if (!this.isMathematicalOperation()) {
				return null;
			}

			try{
				return this.math.evaluate(input ?? '');
			} catch (e) {
				return false;
			}
		}

		public convertTo() {
			if (this.isMathematicalOperation()) {
				this.value = this.calculateResult();
			}
			if (!this.is()) {
				throw new Error((new exception_conversionerror.Core.SError.ConversionErrorException).on());
			}

			this.value = Number(this.value);

			return this;
		}
	}
}