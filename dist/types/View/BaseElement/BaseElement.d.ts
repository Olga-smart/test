declare class BaseElement<T extends keyof HTMLElementTagNameMap> {
    protected component: HTMLElementTagNameMap[T];
    constructor(tag: T, className?: string);
    protected static createComponent<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K];
    getComponent(): HTMLElementTagNameMap[T];
    getBoundingClientRect(): DOMRect;
    getWidth(): number;
    getHeight(): number;
    setIndent(side: 'top' | 'right' | 'bottom' | 'left', indent: number | string): void;
    remove(): void;
}
export default BaseElement;
//# sourceMappingURL=BaseElement.d.ts.map