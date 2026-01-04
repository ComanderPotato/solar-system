interface Debug {
	callbacks: (() => void)[];
	cooldown: number;
	lastLogTime: number;
}
export default class Debugger {
	private static debugs: Map<string, Debug> = new Map();
	static run(): void {
		for (const [id, debug] of Debugger.debugs) {
			Debugger.output(id, debug);
		}
	}
	static add(id: string, callback: () => void, cooldown: number = 2000): void {
		if (Debugger.debugs.has(id)) return;
		Debugger.debugs.set(id, { callbacks: [callback], cooldown: cooldown, lastLogTime: 0 });
	}
	static combine(id: string, callback: () => void): void {
		if (!Debugger.debugs.has(id)) Debugger.add(id, callback);
		Debugger.debugs.get(id)!.callbacks.push(callback);
	}
	static output(id: string, debug: Debug): void {
		const now = performance.now();
		if (now - debug.lastLogTime >= debug.cooldown) {
			console.log(`Running debug with ID: ${id}`);
			debug.callbacks.forEach((callback) => callback());
			debug.lastLogTime = now;
		}
	}
}
