import BaseElement from '../../BaseElement/BaseElement';

class Label extends BaseElement<'div'> {
  constructor(className?: string) {
    super('div', className);
  }

  setOpacity(value: number): void {
    this.component.style.opacity = `${value}`;
  }

  setValue(value: number | string): void {
    this.component.textContent = `${value}`;
  }

  getValue(): number {
    return Number(this.component.textContent);
  }

  getLeftIndent(): string {
    return this.component.style.left;
  }

  getTopIndent(): string {
    return this.component.style.top;
  }
}

export default Label;
