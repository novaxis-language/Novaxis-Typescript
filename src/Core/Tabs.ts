import * as module_path from './Path';
import * as handler_class from './Syntax/Handler/ClassHandler';

export namespace Core {
	export class Tabs {
		private previousTab: number = 0;
		private currentTab: number = 0;
		private Path: module_path.Core.Path;

		constructor() {
			this.Path = new module_path.Core.Path;
		}

		public getTabCountInLine(line: string) {
			const pattern = /^(\t*|\s*)\S/;
			const matches = line.match(pattern);
		
			if (matches) {
				const tabs = matches[1];
				return tabs.length;
			}
		
			return 0;
		}

		public getDifferenceNumber(previousLine: string, currentLine: string): number {
			return this.getTabCountInLine(previousLine) - this.getTabCountInLine(currentLine);
		}

		public getDifferenceNumbers(previousLine: number, currentLine: number): number {
			return previousLine - currentLine;
		}

		public handling(previousLine: string, currentLine: string): string | undefined {
			var previousLineTabs = this.getTabCountInLine(previousLine);
			var currentLineTabs = this.getTabCountInLine(currentLine);
	
			if (previousLineTabs < currentLineTabs) {
				return 'forward';
			}
			else if (previousLineTabs > currentLineTabs) {
				return 'backward';
			}
			else if (previousLineTabs == currentLineTabs) {
				return 'nothing';
			}
		}

		public execute(
			classHandler: handler_class.Core.Handler.ClassHandler,
			tabHandling: string,
			previousLine: string,
			currentLine: string,
			nextLine: string,
			firstline: boolean
		) {
			var forwardClassName: string | null = null;
			var classDatatype: string | null = null;
			
			if ((tabHandling == 'forward' || firstline) && this.handling(currentLine, nextLine) == 'forward') {
				forwardClassName = classHandler.getClassName(currentLine);
				classDatatype = classHandler.getClassDatatype(currentLine);
			}
			else if (tabHandling == 'backward') {
				if (this.handling(currentLine, nextLine) == 'forward') {
					forwardClassName = classHandler.getClassName(currentLine);
					classDatatype = classHandler.getClassDatatype(currentLine);
				}
			}
			else if (tabHandling == 'nothing' && this.handling(currentLine, nextLine) == 'forward') {
				forwardClassName = classHandler.getClassName(currentLine);
				classDatatype = classHandler.getClassDatatype(currentLine);
			}
	
			return {
				forwardClassName: forwardClassName,
				classDatatype: classDatatype
			};
		}
	}
}