interface Debug {
	callback: () => void;
	cooldown: number;
	lastLogTime: number;
}
export default class Debugger {
	// private static debugs: Debug[] = [];
	// static run(): void {
	// 	for (const debug of Debugger.debugs) {
	// 		Debugger.output(debug);
	// 	}
	// }
	// static add(callback: () => void, cooldown: number): void {
	// 	Debugger.debugs.push({ callback, cooldown, lastLogTime: 0 });
	// }
	private static lastLogTime = 0;
	static output(callback: () => void): void {
		const now = performance.now();
		if (now - Debugger.lastLogTime >= 5000) {
			callback();
			Debugger.lastLogTime = now;
		}
	}
}
