import * as token_path from '../../Token/PathTokens';
import * as datatype_list from '../../Datatype/ListType';
import * as datatype_number from '../../Datatype/NumberType';
import * as token_variable from '../../Token/VariableTokens';
import * as exception_variableinterpolation from '../../../SError/VariableInterpolationException';
import * as exception_interpolationpathnotfound from '../../../SError/InterpolationPathNotFoundException';
import * as module_visibilitysyntax from './VisibilitySyntax';
import { exit } from 'process';

export namespace Core.Syntax.Handler.Variable {
	export class Interpolation {
		private ListType: datatype_list.Core.Syntax.Datatype.ListType;
		private NumberType: datatype_number.Core.Syntax.Datatype.NumberType;
		private VisibilitySyntax: module_visibilitysyntax.Core.Syntax.Handler.Variable.VisibilitySyntax;
		private PATH_SEPARATOR!: any;
		
		private pattern: RegExp = /(?<!\\\\)(\\\\\\\\)*\{[^{}\\\\]*(?:\\\\.[^{}\\\\]*)*[^{}\\\\]*\}(?!\\\\)/;

		constructor() {
			this.ListType = new datatype_list.Core.Syntax.Datatype.ListType;
			this.NumberType = new datatype_number.Core.Syntax.Datatype.NumberType;
			this.VisibilitySyntax = new module_visibilitysyntax.Core.Syntax.Handler.Variable.VisibilitySyntax;
			this.PATH_SEPARATOR = token_path.Core.Syntax.Token.PathTokens.PATH_SEPARATOR;
		}

		public hasInterpolation(input: string): boolean {
			return typeof input ? this.pattern.test(input) : false;
		}

		public getInterpolations(input: string) {
			var matches = input.match(this.pattern) ?? [null];

			return matches[0];
		}

		public removeBraces(input: string) {
			return input.trim().replace(/[\\{}]/g, '');
		}

		public replaceValue(
			input: string,
			jsonData: Record<string, any>,
			basePath: string | null = null,
			order: string = 'value'
		): string {
			order = order.trim().toLowerCase()
			
			if (!['value', 'datatype'].includes(order)) {
				order = 'value';
			}
			const variableCount = (input.match(/{/g) || []).length;
			let tempInput = input;

  			for (let _ = 0; _ <= variableCount; _++) {
				input = input.replace(this.pattern, (match) => {
					if (this.NumberType.isMathematicalOperation(this.removeBraces(match))) {
						return this.NumberType.calculateResult(this.removeBraces(match)).toString();
					}
					
					let variable = this.removeBraces(match).replace(/\s/g, '');
					let currentVariable = variable;
					
					if (currentVariable.split('.').length > 1 && basePath) {
						const parts = currentVariable.split('.');
						if (parts[1] === 'self' && parts[0] === '.') {
							currentVariable = `${basePath}${this.PATH_SEPARATOR}${parts.slice(2).join(this.PATH_SEPARATOR)}`;
						}
					}
					
					if (!jsonData[currentVariable] || !jsonData[currentVariable][order] || !jsonData[currentVariable]['visibility']) {
						throw Error((new exception_interpolationpathnotfound.Core.SError.InterpolationPathNotFoundException(`The specified path '${currentVariable}' does not exist in the data structure.`).on()));
					}
					
					const currentVisibility = jsonData[currentVariable]['visibility'];
					
					if (!this.VisibilitySyntax.fit(currentVisibility, currentVariable, basePath ?? '.', true)) {
						throw new Error((new exception_variableinterpolation.Core.SError.VariableInterpolationException).on());
					}
					
					let value = '';
					if (Array.isArray(jsonData[currentVariable][order])) {
						value = this.ListType.arrayToString(jsonData[currentVariable][order]);
						
						if (jsonData[currentVariable][order].length >= 2) {
							value = this.ListType.removeFirstAndLastLetter(value);
						}
					} else {
						value = String(jsonData[currentVariable][order]);
					}
					
					return match.split('{')[0] + value + match.split('}')[1];
				});
			}
			
			return input;
		}

		public execute(value: string, items: Record<string, any>, path: string) {
			if (this.hasInterpolation(value)) {
				return this.replaceValue(value, items, path);
			}

			return false;
		}
	}
}