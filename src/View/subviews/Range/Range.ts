import BaseElement from '../../BaseElement/BaseElement';

class Range extends BaseElement<'div'> {
  constructor() {
    super('div', 'range-slider__range');
  }

  setWidth(percent: number): void {
    this.component.style.width = `${percent}%`;
  }

  setHeight(percent: number): void {
    this.component.style.height = `${percent}%`;
  }

  resetWidth(): void {
    this.component.style.width = 'unset';
  }

  resetHeight(): void {
    this.component.style.height = 'unset';
  }

  resetTopIndent(): void {
    this.component.style.top = 'unset';
  }
}

export default Range;
