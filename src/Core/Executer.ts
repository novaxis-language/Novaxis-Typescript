import * as datatype_inheritance from './Syntax/Datatype/InheritanceType';
import * as exception_notallowed from './SError/NotAllowedException';
import * as handler_class from './Syntax/Handler/ClassHandler';
import * as handler_comment from './Syntax/Handler/CommentHandler';
import * as handler_datatype from './Syntax/Handler/DatatypeHandler';
import * as handler_variable from './Syntax/Handler/VariableHandler';
import * as module_interpolation from './Syntax/Handler/Variable/Interpolation';
import * as module_listcounter from './Syntax/Handler/Variable/ListMethod/Counter';
import * as module_maximumelements from './Syntax/Handler/H_Class/MaximumElements';
import * as module_path from './Path';
import * as module_tabs from './Tabs';
import { isFalsy } from 'utility-types';

export namespace Core {
	export class Executer {
		private Path: module_path.Core.Path;
		private Tabs: module_tabs.Core.Tabs;
		private ClassHandler: handler_class.Core.Handler.ClassHandler;
		private CommentHandler: handler_comment.Core.Handler.CommentHandler;
		private DatatypeHandler: handler_datatype.Core.Syntax.Handler.DatatypeHandler;
		private VariableHandler: handler_variable.Core.Syntax.Handler.VariableHandler;
		private InheritanceType: datatype_inheritance.Core.Syntax.Datatype.InheritanceType;
		private listCounter: module_listcounter.Core.Syntax.Handler.ListMethod.Counter;
		private Interpolation: module_interpolation.Core.Syntax.Handler.Variable.Interpolation;
		private MaximumElements: module_maximumelements.Core.Syntax.Handler.H_Class.MaximumElements;
		private listCounterStartedMaster: { [key: string]: any } = {started: false, name: null};
		private listCounterStarted: { [key: string]: any } = {started: false, name: null};
		private listCounterLineTabs: number = 0;
		private wasInListCounter: boolean = false;

		constructor(Path: module_path.Core.Path) {
			this.Path = new module_path.Core.Path;
			this.Tabs = new module_tabs.Core.Tabs;
			this.ClassHandler = new handler_class.Core.Handler.ClassHandler;
			this.CommentHandler = new handler_comment.Core.Handler.CommentHandler;
			this.DatatypeHandler = new handler_datatype.Core.Syntax.Handler.DatatypeHandler;
			this.VariableHandler = new handler_variable.Core.Syntax.Handler.VariableHandler;
			this.InheritanceType = new datatype_inheritance.Core.Syntax.Datatype.InheritanceType;
			this.listCounter = new module_listcounter.Core.Syntax.Handler.ListMethod.Counter;
			this.Interpolation = new module_interpolation.Core.Syntax.Handler.Variable.Interpolation;
			this.MaximumElements = new module_maximumelements.Core.Syntax.Handler.H_Class.MaximumElements;
		}

		public hasUnnecessaryLines(line: string | null): boolean {
			if (this.CommentHandler.is(line ?? '') || isFalsy((line ?? '').trim())) {
				if (this.CommentHandler.is(line ?? '')) {
					if (isFalsy((this.CommentHandler.split(line ?? ''))?.trim())) {
						return true;
					}
				}
	
				else if (isFalsy(line?.trim())) {
					return true;
				}
			}
	
			return false;
		}

		public isAddingNewItemAllowed(allVariableDetails: { [key: string]: any }) {
			if (this.MaximumElements.allowed(this.Path.getFullPath())) {
				this.Path.addItem(allVariableDetails.name, allVariableDetails.datatype.replace(/^\w/, (c: string) => c.toUpperCase()), allVariableDetails.value, allVariableDetails.visibility);
				this.MaximumElements.loseAChance(this.Path.getFullPath());
			}
			else {
				throw new Error((new exception_notallowed.Core.SError.NotAllowedException).on());
			}
		}

		public executiveListCounter(currentLine: string) {
			if (this.listCounterStarted.started == true) {
				this.listCounter.should(currentLine);
				this.listCounter.storage(currentLine.trim());
		
				if (this.listCounter.able()) {
					var value = this.listCounter.getStorage();
					value = (this.Interpolation.execute(
						value,
						this.Path.getItems(),
						this.Path.clean(this.Path.getFullPath())
						)
					) || value;
					
					this.Path.addItem(
						this.listCounterStarted.name,
						this.listCounterStarted.datatype,
						value,
						this.listCounterStarted.visibility
					); // Continuous updating
					
					this.DatatypeHandler.createDatatype('list', value);
					value = this.DatatypeHandler.getValue();
					
					this.listCounterStarted.value = value;
	
					this.isAddingNewItemAllowed(this.listCounterStarted);
					
					this.wasInListCounter = true;
					this.listCounterStarted = this.listCounterStartedMaster;
	
					return this.Path.getItems();
				}
				else {
					return;
				}
			}
		}

		public resetListCounterSettings() {
			this.listCounterLineTabs = 0;
			this.wasInListCounter = false;
	
			return this;
		}

		public executiveClass(currentLine: string, values: { [key: string]: any }) {
			var forwardClassName: any = null;
			var classDatatype: any = null;
	
			if (this.ClassHandler.isClass(currentLine)) {
				var tabHandlingExecuteConnection = this.Tabs.execute(
					this.ClassHandler,
					values.tabHandling ?? null,
					values.previousLine ?? null,
					currentLine,
					values.nextLine ?? null,
					values.firstline ?? null
				);
				
				forwardClassName = tabHandlingExecuteConnection.forwardClassName;
				classDatatype = tabHandlingExecuteConnection.classDatatype;
				
				if (forwardClassName || classDatatype) {
					this.Path.forward(String(forwardClassName).trim());
					
					if (classDatatype) {
						this.InheritanceType.addItem(this.Path.getFullPath(), classDatatype);
					}
				}
				
				if (this.ClassHandler.hasMaximumNumber(currentLine)) {
					var maximumValue: string = this.ClassHandler.getMaximumNumber(currentLine);
					maximumValue = (this.Interpolation.execute(maximumValue, this.Path.getItems(), this.Path.clean(this.Path.getFullPath()))) || maximumValue;
					
					this.MaximumElements.addItem(this.Path.getFullPath(), Number(maximumValue));
				}
				
				return this.Path.getItems();
			}
		}

		public isInheritanceDatatype(allVariableDetails: { [key: string]: any }) {
			if (allVariableDetails.datatype === null || isFalsy(allVariableDetails.datatype)) {
				return this.InheritanceType.getItem(this.Path.getFullPath());
			}
	
			return null;
		}

		public listCounterStartExecute(currentLine: string, allVariableDetails: { [key: string]: any }) {
			if (this.listCounter.is(allVariableDetails)) {
				this.listCounterLineTabs = this.Tabs.getTabCountInLine(currentLine);
				this.listCounter.should(allVariableDetails.value);
	
				if (!(this.listCounter.able())) {
					this.listCounter.storage(allVariableDetails.value);
					this.listCounterStarted = {
						started: true,
						name: allVariableDetails.name,
						datatype: 'List',
						visibility: allVariableDetails.visibility
					};
					
					return false;
				}
	
				this.listCounterLineTabs = 0;
			}
	
			return true;
		}

		public executiveVariable(currentLine: string) {
			if (this.VariableHandler.isVariable(currentLine)) {
				var allVariableDetails = this.VariableHandler.getAllVariableDetails(currentLine);
				
				var valueBefore = this.CommentHandler.is(allVariableDetails.value ?? '') ? this.CommentHandler.split(allVariableDetails.value ?? '') : allVariableDetails.value;
				allVariableDetails.value = (typeof valueBefore == 'undefined' || valueBefore === null) ? null : valueBefore;
				allVariableDetails.datatype = this.isInheritanceDatatype(allVariableDetails) || allVariableDetails.datatype;
				
				allVariableDetails.value = (this.Interpolation.execute(allVariableDetails.value ?? '', this.Path.getItems(), this.Path.clean(this.Path.getFullPath()))) || allVariableDetails.value;
				allVariableDetails.datatype = this.DatatypeHandler.datatypeInterpolation(allVariableDetails.datatype ?? '', this.Path.getItems(), this.Path.getFullPath());
				
				if (this.listCounter.is(allVariableDetails)) {
					this.listCounterLineTabs = this.Tabs.getTabCountInLine(currentLine);
					this.listCounter.should(allVariableDetails.value ?? '');
	
					if (!(this.listCounter.able())) {
						this.listCounter.storage(allVariableDetails.value ?? '');
						this.listCounterStarted = {
							started: true,
							name: allVariableDetails.name,
							datatype: 'List',
							visibility: allVariableDetails.visibility
						};
						
						return;
					}
	
					this.listCounterLineTabs = 0;
				}
	
				if (this.listCounterStartExecute(currentLine, allVariableDetails) === false) {
					return;
				}
	
				this.DatatypeHandler.createDatatype(allVariableDetails.datatype, allVariableDetails.value);
				allVariableDetails.value = this.DatatypeHandler.getValue();
	
				if (this.DatatypeHandler.getDatatype() === 'Auto') {
					var autoValues = this.DatatypeHandler.getDatatypeConnection().getItem();
					
					allVariableDetails.datatype = autoValues.datatype;
					allVariableDetails.value = autoValues.value;
				}
				
				this.isAddingNewItemAllowed(allVariableDetails);
	
				return this.Path.getItems();
			}
		}

		public executiveClassbox(currentLine: string) {
			if (this.ClassHandler.isClassBox(currentLine)) {
				var classBox = this.ClassHandler.getClassBox(currentLine);
				
				var path = this.Path /* .backward() */ .getFullPath();
				
				if (this.InheritanceType.isUnsetKeyword(classBox ?? '')) {
					this.InheritanceType.unset(path);
				}
				else {
					this.InheritanceType.addItem(path, classBox ?? '');
				}
	
				return this.Path.getItems();
			}
		}

		public executiveParts(currentLine: string, values: { [key: string]: any } | null = []) {
			var return_values: { [key: string]: any } = {
				listCounter: this.executiveListCounter(currentLine),
				variable: this.executiveVariable(currentLine),
				classbox: this.executiveClassbox(currentLine)
			};
			
			if (values) {
				return_values.class = this.executiveClass(currentLine, values);
			}
	
			return return_values;
		}

		public parameter(previousLine: string | null, currentLine: string | null | undefined, nextLine: string | null, firstline: boolean = false) {
			var tabHandling = this.Tabs.handling(previousLine ?? '', currentLine ?? '');
			currentLine = this.CommentHandler.is(currentLine ?? '') ? this.CommentHandler.split(currentLine ?? '') : currentLine;
	
			if (this.listCounterStarted.started == true) {
				return this.executiveParts(currentLine ?? '').listCounter;
			}
			
			if (tabHandling == 'backward' || this.wasInListCounter === true) {
				this.Path.backward(this.Tabs.getDifferenceNumbers(this.wasInListCounter === false ? this.Tabs.getTabCountInLine(previousLine ?? '') : this.listCounterLineTabs, this.Tabs.getTabCountInLine(currentLine ?? '')));
				
				if (this.wasInListCounter === true) {
					this.resetListCounterSettings();
				}
			}
	
			if (this.ClassHandler.isClass(currentLine ?? '')) {
				return this.executiveParts(currentLine ?? '', {
					tabHandling: tabHandling,
					previousLine: previousLine,
					nextLine: nextLine,
					firstLine: firstline
				}).class;
			}
			
			if (this.VariableHandler.isVariable(currentLine ?? '')) {
				return this.executiveParts(currentLine ?? '').variable;
			}
	
			if (this.ClassHandler.isClassBox(currentLine ?? '')) {
				return this.executiveParts(currentLine ?? '').classbox;
			}
		}
	}
}