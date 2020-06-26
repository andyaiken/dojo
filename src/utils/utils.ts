export default class Utils {
	public static guid(): string {
		const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	public static sort(collection: any[], sorts: { field: string, dir: 'asc' | 'desc' }[] = []): any[] {
		if (sorts.length === 0) {
			sorts = [{ field: 'name', dir: 'asc' }];
		}

		const fn = (a: any, b: any, field: string): number => {
			if ((a[field] !== undefined) && (b[field] !== undefined)) {
				if (a[field] < b[field]) { return -1; }
				if (a[field] > b[field]) { return 1; }
			}
			return 0;
		};

		collection.sort((a, b) => {
			let order = 0;
			sorts.forEach(sort => {
				if (order === 0) {
					order = fn(a, b, sort.field) * (sort.dir === 'asc' ? 1 : -1);
				}
			});
			return order;
		});

		return collection;
	}

	public static debounce(func: () => void, delay: number = 500) {
		let timeout: NodeJS.Timeout;
		return () => {
			clearTimeout(timeout);
			timeout = setTimeout(func, delay);
		};
	}

	public static toData(value: number) {
		const gb = value / (1024 * 1024 * 1024);
		if (gb >= 1) {
			return gb.toFixed(2) + ' GB';
		} else {
			const mb = value / (1024 * 1024);
			if (mb >= 1) {
				return mb.toFixed(2) + ' MB';
			} else {
				const kb = value / 1024;
				if (kb >= 1) {
					return kb.toFixed(2) + ' KB';
				}
			}
		}

		return value + ' B';
	}

	public static saveFile(filename: string, data: any) {
		const json = JSON.stringify(data, null, '\t');
		const blob = new Blob([json], { type: 'application/json' });
		const a = document.createElement('a');
		a.download = filename;
		a.href = window.URL.createObjectURL(blob);
		a.click();
	}

	public static randomNumber(max: number) {
		return Math.floor(Math.random() * max);
	}

	public static randomBoolean() {
		return Utils.randomNumber(2) === 0;
	}
}
