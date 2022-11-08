declare class EventManager {
    private listeners;
    subscribe(listener: IEventListener): void;
    unsubscribe(listener: IEventListener): void;
    notify(eventType: string, data?: number | null): void;
}
interface IEventListener {
    inform(eventType: string, data: number | null): void;
}
export { EventManager, IEventListener };
//# sourceMappingURL=EventManager.d.ts.map