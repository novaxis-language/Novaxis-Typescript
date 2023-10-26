import * as module_autotype from './AutoType';
import * as exception_conversionerror from '../../SError/ConversionErrorException';
import * as interface_types from './TypeInterface';
import { exit } from 'process';

export namespace Core.Syntax.Datatype {
	export class ListType implements interface_types.Core.Syntax.Datatype.TypesInterface {
		public dataTypeName: string = 'List';
		private items!: any[];
		private input!: any[] | string;
		private AutoType: module_autotype.Core.Syntax.Datatype.AutoType;

		constructor() {
			this.AutoType = new module_autotype.Core.Syntax.Datatype.AutoType;
		}

		public setValue(input: string) {
			this.input = input;
			return this;
		}

		public getValue() {
			return this.input;
		}

		public is(): boolean {
			var input = typeof this.input === "string" ? this.input.trim() : "";

			return input.startsWith('[') && input.endsWith(']');
		}

		public convertTo() {
			if (!(this.is())) {
				throw new Error((new exception_conversionerror.Core.SError.ConversionErrorException).on());
			}

			const result: any[] = [];
			let currentItem = '';
			const stack: any[] = [];
			let backslash = false;
			
			for (let i = 0; i < this.input.length; i++) {
				const letter = this.input[i];

				if (letter === '\\') {
					backslash = true;
				}
				else if (letter === '[' && !backslash) {
					if (currentItem.trim() !== '') {
						result.push(currentItem.trim());
					}
					
					currentItem = '';
					stack.push([...result]);
					result.length = 0;
				}
				else if (letter === ']' && !backslash) {
					if (currentItem.trim() !== '') {
						result.push(currentItem.trim());
					}
					
					const poppedItem = stack.pop();
					if (poppedItem) {
						poppedItem.push([...result]);
						result.length = 0;
						result.push(...poppedItem);
					}
					currentItem = '';
				}
				else if (letter === ',' && !backslash) {
					if (currentItem.trim() !== '') {
						result.push(currentItem.trim());
					}
					
					currentItem = '';
				}
				else {
					currentItem += letter;
					backslash = false;
				}
			}
			
			if (currentItem !== '') {
				result.push(currentItem.trim());
			}

			this.items = this.filter(result)
			this.input = this.items;
			return this;
		}
		  
		
		public filter(list: any[]): any[] {
			const result: any[] = [];
	  
			for (const element of list) {
				if (Array.isArray(element)) {
					result.push(this.filter(element));
				} else {
					this.AutoType.setDatatype('Auto (number, boolean, byte, null, list, string)')
					this.AutoType.setValue(element);
					this.AutoType.convertTo();
					result.push(this.AutoType.getItem().value);
				}
			}
	  
			return result;
		}
		
		public getItems() {
			return this.items;
		}

		public removeFirstAndLastLetter(input: string) {
			if (input.length <= 2) {
				return '';
			} else {
				return input.substring(1, input.length - 1);
			}
		}
		
		public arrayToString(inputArray: any[], final: boolean = true): string {
			const result: string[] = [];
		  
			for (const item of inputArray) {
				if (Array.isArray(item)) {
					result.push('[' + this.arrayToString(item, false) + ']');
				} else {
					result.push(String(item));
				}
			}
			
			if (final) {
				return '[' + result.join(', ') + ']';
			}
			
			return result.join(', ');
		}
	}
}