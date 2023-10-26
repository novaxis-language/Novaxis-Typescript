import * as module_executer from './Executer';
import * as module_reader from './File/Reader';
import * as module_path from './Path';
import * as exception from './SError/Exception';
import * as module_visibilitysyntax from './Syntax/Handler/Variable/VisibilitySyntax';
import os from 'os';

export namespace Core {
	export class Runner {
		private filename: string;
		private Reader: module_reader.Core.File.Reader;
		private Executer: module_executer.Core.Executer;
		private VisibilitySyntax: module_visibilitysyntax.Core.Syntax.Handler.Variable.VisibilitySyntax;
	
		constructor(filename: string) {
			this.filename = filename;
			this.Reader = new module_reader.Core.File.Reader(this.filename);
			this.Executer = new module_executer.Core.Executer(new module_path.Core.Path());
			this.VisibilitySyntax = new module_visibilitysyntax.Core.Syntax.Handler.Variable.VisibilitySyntax;
		}

		public getIndentationLevel(line: string): number {
			return line.search(/\S|$/);
		}

		public execute(): any {
			const lines: string[] = this.Reader.readRemoved();
			let firstline: boolean = true;
			let previousLine: string | null = null;
			let lineNumber: number | undefined;
		  
			try {
				let value: any;
				for (let i = 0; i < lines.length; i++) {
					const line: string = lines[i];
					const nextLine: string | undefined = lines[i + 1];
					
					if (this.Executer.hasUnnecessaryLines(line) === true) {
						continue;
					}
					
					value = this.Executer.parameter(previousLine, line, nextLine, firstline);
					firstline = false;
					previousLine = line;
					lineNumber = i + 1;
				}
				
				if (value === null) {
					throw new exception.Core.SError.Exception(null, 0);
				}
				
				return this.VisibilitySyntax.remover(value);
			} catch (e) {
				// if (e instanceof exception.Core.SError.Exception) {
				// 	e.setLineNumber(lineNumber ?? 0)
				// 	console.log(e.message + os.EOL)
				// }
				// if (e instanceof TypeError) {
				// 	throw new exception.Core.SError.Exception(null, 0);
				// }
				
				// if (lineNumber !== undefined) {
				// 	e.lineNumber = lineNumber;
				// }
				
				console.log(e);
			}
		}		  
	}
}