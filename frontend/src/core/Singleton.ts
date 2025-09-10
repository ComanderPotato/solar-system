export default abstract class Singleton {
	private static instances = new Map<Function, any>();
	protected static getInstance<T extends Singleton>(key: Function, callback: () => T): T {
		if (!Singleton.instances.has(key)) Singleton.instances.set(key, callback());
		console.log(Singleton.instances);
		return Singleton.instances.get(key)!;
	}
	protected static get instance(): Singleton {
		throw new Error("Access 'instance' on a concrete subclass, not Singleton directly.");
	}
}
