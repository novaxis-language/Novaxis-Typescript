import * as fs from "fs";
import * as exception_filenotfound from '../SError/FileNotFoundException';

export namespace Core.File {
	export class Reader {
		filename: string;
		public constructor(filename: string) {
			this.filename = filename;
		}
	
		public read() {
			return fs.readFileSync(this.filename);
		}
	
		public readRemoved(): string[] {
			if (!fs.existsSync(this.filename)) {
				throw new Error((new exception_filenotfound.Core.SError.FileNotFoundException(`The specified '${this.filename}' file could not be located or accessed.`)).on());
			}
		
			const fileContent = fs.readFileSync(this.filename, 'utf8');
			const fileLines = fileContent.split('\n');
		
			return fileLines;
		}
	}
}