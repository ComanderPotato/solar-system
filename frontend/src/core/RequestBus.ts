export default class RequestBus<Requests extends Record<string, { request: any; response: any }>> {
	private handlers = new Map<keyof Requests, (req: any) => Promise<any>>();

	handle<K extends keyof Requests>(
		event: K,
		handler: (req: Requests[K]["request"]) => Promise<Requests[K]["response"]> | Requests[K]["response"],
	) {
		this.handlers.set(event, async (req: any) => handler(req));
	}

	async request<K extends keyof Requests>(event: K, req: Requests[K]["request"]): Promise<Requests[K]["response"]> {
		const handler = this.handlers.get(event);
		if (!handler) throw new Error(`No handler registered for ${String(event)}`);
		return await handler(req);
	}
}
