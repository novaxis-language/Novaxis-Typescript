import { exit } from 'process';
import * as module_path from '../../../Path';
import * as module_variabletokens from '../../Token/VariableTokens';

export namespace Core.Syntax.Handler.Variable {
	export class VisibilitySyntax {
		private stylesArray = {
			public: [true, true, true],
			protected: [true, true, false],
			inherited: [true, false, false],
			private: [false, false, true],
			restricted: [false, true, true]
		}
		private Path: module_path.Core.Path;

		constructor() {
			this.Path = new module_path.Core.Path;
		}

		public styles(specfic: string | null = null) {
			if (specfic) {
				if (Object.keys(this.stylesArray).includes(specfic.trim().toLowerCase())) {
					return Object(this.stylesArray)[specfic.trim().toLowerCase()];
				}
			}

			return this.stylesArray;
		}

		public isInterpolatableIn(visbility: string, firstPath: string, secondPath: string, final: boolean = false): boolean {
			var firstPathCall = this.Path.setFullPath(firstPath).getParent();
			var secondPathCall = (final === false) ? this.Path.setFullPath(secondPath).getParent() : secondPath;

			if (firstPathCall == secondPathCall && this.styles(visbility)[1] === true) {
				return true;
			}

			return false;
		}

		public isInterpolatableOut(visibility: string) {
			if (this.styles(visibility)[0] === true) {
				return true;
			}

			return false;
		}

		public isDisplayable(visibility: string) {
			if (this.styles(visibility)[2] === true) {
				return true;
			}

			return false;
		}

		public fit(visibility: string, firstPath: string, secondPath: string, final: boolean = false) {
			var firstPathCall = this.Path.setFullPath(firstPath).getParent();
			var secondPathCall = (final === false) ? this.Path.setFullPath(secondPath).getParent() : secondPath;

			if (firstPathCall == secondPathCall) {
				return this.isInterpolatableIn(visibility, firstPath, secondPath, final);
			}
			else if (firstPath != secondPath) {
				return this.isInterpolatableOut(visibility);
			}
		}

		public findRemoversWords(): string[] {
			var stylesArray = this?.stylesArray ?? [];
			const filteredKeys = Object.keys(stylesArray).filter((key) => {
				return Object(this.stylesArray)[key][2] === false;
			});
		
			const visibilityKeywords = filteredKeys.map((key) => {
				return Object(module_variabletokens.Core.Syntax.Token.VariableTokens.VISIBILITY_KEYWORDS)[key];
			});
		
			return visibilityKeywords;
		}

		public remover(array: { [key: string]: any }) {
			var findRemoversWords = this.findRemoversWords;
			var value = Object.keys(array).filter(function(key) {
				return array[key]['visibility'].trim().toLowerCase() in findRemoversWords().map(function(word) {
					return word.toLowerCase();
				});
			}, this);
			value.forEach(function(key) {
				delete array[key];
			});
			return array;
		}

		// public remover(array: { [key: string]: any }): any[] {
		// 	console.log(typeof array, Object.keys(array), array)
		// 	const values = Object.values(array).filter(name => {
		// 		return name.visibility === 'Public';
		// 	});
		// 	console.log(values)
		// 	exit();
		// 	// const value = Object.keys(array.find(values => {
		// 	// 	return this.findRemoversWords().map(word => word.toLowerCase()).includes(values.visibility.trim().toLowerCase());
		// 	// }));

		// 	// value.forEach(key => {
		// 	// 	delete Object(array)[key];
		// 	// });

		// 	// return array;
		// }
	}
}