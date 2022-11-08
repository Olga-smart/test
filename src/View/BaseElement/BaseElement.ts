class BaseElement<T extends keyof HTMLElementTagNameMap> {
  protected component: HTMLElementTagNameMap[T];

  constructor(tag: T, className?: string) {
    this.component = document.createElement(tag);

    if (className) {
      this.component.className = className;
    }
  }

  protected static createComponent<K extends keyof HTMLElementTagNameMap>(
    tag: K, className?: string,
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    return element;
  }

  getComponent(): HTMLElementTagNameMap[T] {
    return this.component;
  }

  getBoundingClientRect(): DOMRect {
    return this.component.getBoundingClientRect();
  }

  getWidth(): number {
    return this.component.offsetWidth;
  }

  getHeight(): number {
    return this.component.offsetHeight;
  }

  setIndent(side: 'top' | 'right' | 'bottom' | 'left', indent: number | string): void {
    if (typeof indent === 'number') {
      this.component.style[side] = `${indent}%`;
    }

    if (typeof indent === 'string') {
      this.component.style[side] = indent;
    }
  }

  remove(): void {
    this.component.remove();
  }
}

export default BaseElement;
