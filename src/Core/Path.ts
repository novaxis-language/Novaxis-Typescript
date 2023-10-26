import * as module_pathtokens from './Syntax/Token/PathTokens';
import * as module_variablehandler from './Syntax/Handler/VariableHandler';
import * as module_escapesequences from './Syntax/Handler/Variable/EscapeSequences';

export namespace Core {
	export class Path {
		private path: string = '';
		private items: { [key: string]: {visibility: string, datatype: string, value: any} } = {};
		private VariableHandler: module_variablehandler.Core.Syntax.Handler.VariableHandler;
		private EscapeSequences: module_escapesequences.Core.Syntax.Handler.Variable.EscapeSequences;
		private PATH_SEPARATOR: string;
		
		constructor() {
			this.VariableHandler = new module_variablehandler.Core.Syntax.Handler.VariableHandler;
			this.EscapeSequences = new module_escapesequences.Core.Syntax.Handler.Variable.EscapeSequences;
			this.PATH_SEPARATOR = module_pathtokens.Core.Syntax.Token.PathTokens.PATH_SEPARATOR;
		}

		public reset() {
			this.path = '';

			return this;
		}

		public setFullPath(input: string) {
			this.path = this.clean(input);

			return this;
		}

		public getFullPath() {
			return this.path;
		}

		public forward(name: string) {
			this.path = this.path.concat(`${this.PATH_SEPARATOR}${name}`);
			this.path = this.clean(this.path);

			return this;
		}

		public tempForward(name: string) {
			return this.clean(`${this.path}${this.PATH_SEPARATOR}${name}`);
		}

		public backward(count: number = 1) {
			if(!this.path.includes(this.PATH_SEPARATOR)) {
				// Moved
			}

			this.path = this.clean(this.path);
			this.path = `${this.PATH_SEPARATOR}${this.path}`;

			var pathSegments = this.path.split(this.PATH_SEPARATOR);
			
			var numSegments = pathSegments.length;
			var numStep = Math.min(count, numSegments - 1);

			for (let i = 0; i < numStep; i++) {
				pathSegments.pop();
			}

			this.path = this.clean(pathSegments.join(this.PATH_SEPARATOR));

			return this;
		}

		public getSegments() {
			return this.path.split(this.PATH_SEPARATOR);
		}

		public getParent() {
			var pathSegments = this.path.split(this.PATH_SEPARATOR);
			
			pathSegments.pop()

			return this.clean(pathSegments.join(this.PATH_SEPARATOR));
		}

		public clean(path: string): string {
			path = path.replace(new RegExp('\\' + this.PATH_SEPARATOR + '{2,}', 'g'), this.PATH_SEPARATOR);
			path = path.replace(/^\.+/, '').replace(/\.+$/, '');;
		
			return path;
		}

		public addItem(name: string, datatype: string, value: any, visibility: string) {
			var path = this.tempForward(name);

			this.items[this.clean(path)] = {
				visibility: visibility,
				datatype: datatype,
				value: this.EscapeSequences.replaceEscapeSequences(value)
			};

			return this;
		}

		public getItems() {
			return this.items;
		}
	}
}