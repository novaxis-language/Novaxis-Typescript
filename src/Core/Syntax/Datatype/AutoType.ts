import * as interface_types from './TypeInterface';
import * as datatype_list from './ListType';
import * as datatype_null from './NullType';
import * as datatype_byte from './ByteType';
import * as datatype_number from './NumberType';
import * as datatype_string from './StringType';
import * as datatype_boolean from './BooleanType';
import * as exception_autotypeconversion from '../../SError/AutotypeConversionException';

export namespace Core.Syntax.Datatype {
	export class AutoType implements interface_types.Core.Syntax.Datatype.TypesInterface {
		public dataTypeName: string = 'Auto';
		private datatype: string = '';
		private value!: string;
		private item!: { [key: string]: any };
		private allTypes!: { [key: string]: any };
		private allConnectedTypes!: { [key: string]: any };
		private notContainsPattern: RegExp = RegExp(/\(\s*not\s*([^)]+)\)/, 'i');
		private sureContainsPattern: RegExp = RegExp( /\(\s*(?!not)([^)]+)\)/, 'i');

		constructor(dataTypes: { [key: string]: any } | null = []) {
			this.item = [];

			this.allTypes = {
				list: dataTypes?.list || datatype_list.Core.Syntax.Datatype.ListType,
				null: dataTypes?.null || datatype_null.Core.Syntax.Datatype.NullType,
				byte: dataTypes?.byte || datatype_byte.Core.Syntax.Datatype.ByteType,
				number: dataTypes?.number || datatype_number.Core.Syntax.Datatype.NumberType,
				boolean: dataTypes?.boolean || datatype_boolean.Core.Syntax.Datatype.BooleanType,
				string: dataTypes?.string || datatype_string.Core.Syntax.Datatype.StringType, // Always the last one
			};

			this.allConnectedTypes = [];
		}

		public setDatatype(datatype: string) {
			this.datatype = datatype;
			return this;
		}

		public setValue(input: any) {
			this.value = input;
			return this;
		}

		public getValue() {
			return this.value;
		}

		public getItem() {
			return this.item;
		}

		public containsNotCode() {
			return this.notContainsPattern.test(this.datatype);
		}

		public getNotDatatypes() {
			const matches = this.datatype.match(this.notContainsPattern);
			return matches && matches[1] ? matches[1] : '';
		}

		public removeNotDatatypes() {
			const notDatatypes = this.getNotDatatypes().split(',').map(datatype => datatype.trim().toLowerCase());
			
			for (const datatype of notDatatypes) {
				if (datatype in this.allTypes) {
					delete this.allTypes[datatype];
				}
			}
			
			return this;
		}

		public containsSureCode() {
			return this.sureContainsPattern.test(this.datatype);
		}

		public getSureDatatypes() {
			const matches = this.datatype.match(this.sureContainsPattern);
			return matches && matches[1] ? matches[1] : '';
		}

		public selectSureDatatypes() {
			const datatypes = this.getSureDatatypes().split(',').map(value => value.trim().toLowerCase());

			const newAllTypes: { [key: string]: any } = {};
			for (const datatype of datatypes) {
				if (this.allTypes.hasOwnProperty(datatype)) {
					newAllTypes[datatype] = this.allTypes[datatype];
				}
			}
			
			this.allTypes = newAllTypes;
			return this;
		}

		public convertTo() {
			if (this.containsNotCode()) {
				this.removeNotDatatypes();
			}
			else if (this.containsSureCode()) {
				this.selectSureDatatypes();
			}

			this.item = [];
		
			var input = String(this.value).trim();
		
			for (var typeClassConnectKey of Object.keys(this.allTypes)) {
				if (!(typeClassConnectKey in this.allConnectedTypes)) {
					this.allConnectedTypes[typeClassConnectKey] = new this.allTypes[typeClassConnectKey]();
				}
				
				const typeClassConnected = this.allConnectedTypes[typeClassConnectKey];
				typeClassConnected.setValue(input);
				
				if (typeClassConnected.is()) {
					this.item = {
						datatype: typeClassConnected.dataTypeName,
						value: typeClassConnected.convertTo().getValue(),
					};
					
					return this;
				}
			}
			
			if (typeof this.item.value !== 'undefined' || this.item.value === null) {
				
				throw new Error((new exception_autotypeconversion.Core.SError.AutotypeConversionException).on());
			}
			
			return this;
		}
	}
}