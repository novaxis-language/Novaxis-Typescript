import * as datatype_auto from '../Datatype/AutoType';
import * as datatype_byte from '../Datatype/ByteType';
import * as datatype_list from '../Datatype/ListType';
import * as datatype_null from '../Datatype/NullType';
import * as datatype_number from '../Datatype/NumberType';
import * as datatype_string from '../Datatype/StringType';
import * as datatype_boolean from '../Datatype/BooleanType';
import * as exception_invaliddatatype from '../../SError/InvalidDataTypeException';
import * as module_interpolation from '../Handler/Variable/Interpolation';

export namespace Core.Syntax.Handler {
	export class DatatypeHandler {
		private dataTypeMap: { [key: string]: any } = {
			number: datatype_number.Core.Syntax.Datatype.NumberType,
			string: datatype_string.Core.Syntax.Datatype.StringType,
			boolean: datatype_boolean.Core.Syntax.Datatype.BooleanType,
			list: datatype_list.Core.Syntax.Datatype.ListType,
			null: datatype_null.Core.Syntax.Datatype.NullType,
			none: datatype_null.Core.Syntax.Datatype.NullType,
			byte: datatype_byte.Core.Syntax.Datatype.ByteType,
			auto: datatype_auto.Core.Syntax.Datatype.AutoType,
		};

		private allConnectedTypes!: any;
		private dataTypeClassConnect!: any;
		private Interpolation: module_interpolation.Core.Syntax.Handler.Variable.Interpolation;

		constructor() {
			this.allConnectedTypes = [];
			this.Interpolation = new module_interpolation.Core.Syntax.Handler.Variable.Interpolation;
		}

		public createDatatype(datatype: string, value: any) {
			if (datatype.toLowerCase().includes('auto')) {
				if (!this.allConnectedTypes.auto) {
					this.allConnectedTypes['auto'] = new this.dataTypeMap['auto'](this.dataTypeMap);
				}
				
				this.dataTypeClassConnect = this.allConnectedTypes['auto'];
				this.dataTypeClassConnect.setDatatype(datatype);
			} else {
				const lowercasedDatatype = datatype.toLowerCase();
		  
				if (!this.dataTypeMap[lowercasedDatatype]) {
					throw new Error((new exception_invaliddatatype.Core.SError.InvalidDataTypeException).on());
				}
				
				if (!this.allConnectedTypes[lowercasedDatatype]) {
					this.allConnectedTypes[lowercasedDatatype] = new this.dataTypeMap[lowercasedDatatype]();
				}
				
				this.dataTypeClassConnect = this.allConnectedTypes[lowercasedDatatype];
			}
			
			this.dataTypeClassConnect?.setValue(value);
			this.dataTypeClassConnect?.convertTo();
		  
			return this;
		}

		public datatypeInterpolation(datatype: string, jsonData: Record<string, any>, basePath: string) {
			if (this.Interpolation.hasInterpolation(datatype)) {
				datatype = this.Interpolation.replaceValue(datatype, jsonData, basePath, 'datatype');
			}

			return datatype;
		}

		public getValue() {
			return this.dataTypeClassConnect.getValue();
		}

		public getDatatype() {
			return this.dataTypeClassConnect.dataTypeName;
		}

		public getDatatypeConnection() {
			return this.dataTypeClassConnect;
		}
	}
}