import * as module_path from '../../Path';
import * as module_pathtokens from '../Token/PathTokens';
import * as module_classtokens from '../Token/ClassTokens';

export namespace Core.Syntax.Datatype {
	export class InheritanceType {
		private items: { [key: string]: string } = {};
		private Path: module_path.Core.Path;

		constructor() {
			this.Path = new module_path.Core.Path;
		}

		public addItem(path: string, datatype: string) {
			this.items[this.Path.clean(path)] = (datatype.charAt(0).toUpperCase().concat(datatype.slice(1))).trim();

			return this;
		}

		public getItem(path: string): any | null {
			path = this.Path.clean(path);
			this.Path.setFullPath(path);
	  
			const pathSegments = path.split(module_pathtokens.Core.Syntax.Token.PathTokens.PATH_SEPARATOR);
			const numSegments = pathSegments.length;
	  
			for (let rounds = 0; rounds <= numSegments; rounds++) {
				const fullPath = this.Path.getFullPath();
				if (this.items.hasOwnProperty(fullPath)) {
					return this.items[fullPath];
				}
	  
				this.Path.backward();
			}
	  
			if (this.items[''] !== undefined && this.Path.getFullPath() === '') {
				return this.items[''];
			}
	  
			return null;
		}

		public getItems() {
			return this.items;
		}

		public isUnsetKeyword(datatype: string): boolean {
			const trimmedDatatype = datatype.trim();
			const trimmedKeyword = module_classtokens.Core.Syntax.Token.ClassTokens.UNSET_CLASSBOX_KEYWORD.trim();
	  
			if (module_classtokens.Core.Syntax.Token.ClassTokens.ANYCASE_UNSET_CLASSBOX_KEYWORD) {
				return trimmedDatatype.toLowerCase() === trimmedKeyword.toLowerCase();
			} else {
				return trimmedDatatype === trimmedKeyword;
			}
		}

		public unset(path: string | null) {
			if (path === null) {
				delete this.items[''];
			}
			else {
				delete this.items[path.trim()];
			}
		}
	}
}