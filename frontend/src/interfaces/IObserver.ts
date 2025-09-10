type Callback<T = any> = (data: T) => void;
interface IObservable<TEvents extends Record<string, any>> {
	observers: Map<keyof TEvents, Callback[]>;

	on<K extends keyof TEvents>(event: K, callback: Callback<TEvents[K]>): void;
	off<K extends keyof TEvents>(event: K, callback: Callback<TEvents[K]>): void;
	emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void;
}

interface IObserver<T = any> {
	update(data: T): void;
}
