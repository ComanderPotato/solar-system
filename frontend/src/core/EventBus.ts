export default class EventBus<Events extends Record<string, any>> {
	private listeners = new Map<keyof Events, ((data: any) => void)[]>();

	on<K extends keyof Events>(event: K, callback: (data: Events[K]) => void) {
		if (!this.listeners.has(event)) this.listeners.set(event, []);
		this.listeners.get(event)!.push(callback as (data: any) => void);
	}

	emit<K extends keyof Events>(event: K, data: Events[K]) {
		this.listeners.get(event)?.forEach((cb) => cb(data));
	}
}
