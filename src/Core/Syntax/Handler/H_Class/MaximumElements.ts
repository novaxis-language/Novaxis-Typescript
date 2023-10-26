import * as module_path from '../../../Path';

export namespace Core.Syntax.Handler.H_Class {
	export class MaximumElements {
		private Path: module_path.Core.Path;
		private items: { [key: string]: any };

		constructor() {
			this.Path = new module_path.Core.Path;
			this.items = {};
		}

		public addItem(path: string, maximum: number) {
			var path = this.Path.clean(path);
			this.items[path] = maximum;

			return this;
		}

		public getItem(path: string) {
			path = this.Path.clean(path);

			return this.items[path];
		}

		public getItems() {
			return this.items;
		}

		public loseAChance(path: string) {
			var path = this.Path.clean(path);

			if(Object.keys(this.items).includes(path)) {
				if (this.items[path] > 0) {
					this.items[path] --;
				}
			}

			return this;
		}

		public allowed(path: string) {
			path = this.Path.clean(path);

			if (Object.keys(this.items).includes(path)) {
				if (this.items[path] > 0) {
					return true;
				}
			}
			else {
				return true;
			}

			return false;
		}
	}
}