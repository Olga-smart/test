import BaseElement from '../../BaseElement/BaseElement';

type ViewForScale = {
  getScaleIntervals(): number,
  handleScaleOrTrackClick(x: number, y: number): void,
};

class Scale extends BaseElement<'div'> {
  private view: ViewForScale;

  private intervals: HTMLDivElement[];

  private values: number[];

  private valueElements: HTMLSpanElement[];

  constructor(min: number, max: number, view: ViewForScale) {
    super('div', 'range-slider__scale');

    this.view = view;
    this.intervals = [];
    this.values = [];
    this.valueElements = [];

    const intervalsNumber = view.getScaleIntervals();

    this.createIntervals(intervalsNumber);
    this.addMarksInIntervals(intervalsNumber);
    this.addValues(min, max, intervalsNumber);
    this.attachEventHandlers();
  }

  fitWidthForVertical(indent: number = 3): void {
    let maxWidth = 0;

    this.valueElements.forEach((valueElement) => {
      if (valueElement.offsetWidth > maxWidth) {
        maxWidth = valueElement.offsetWidth;
      }
    });

    this.component.style.paddingRight = `${maxWidth + indent}px`;
  }

  fitHeightForHorizontal(indent: number = 3): void {
    let maxHeight = 0;

    this.valueElements.forEach((valueElement) => {
      if (valueElement.offsetHeight > maxHeight) {
        maxHeight = valueElement.offsetHeight;
      }
    });

    this.component.style.paddingBottom = `${maxHeight + indent}px`;
  }

  handleSwitchFromHorizontalToVertical(): void {
    this.component.style.paddingBottom = 'unset';
    this.fitWidthForVertical();
  }

  handleSwitchFromVerticalToHorizontal(): void {
    this.component.style.paddingRight = 'unset';
    this.fitHeightForHorizontal();
  }

  private createIntervals(intervalsNumber: number): void {
    const fragment = new DocumentFragment();

    for (let i = 0; i < intervalsNumber; i += 1) {
      this.intervals[i] = BaseElement.createComponent('div', 'range-slider__scale-interval');
      fragment.append(this.intervals[i]);
    }

    this.component.append(fragment);
  }

  private addMarksInIntervals(intervalsNumber: number): void {
    this.intervals.forEach((item) => {
      const fragment = new DocumentFragment();

      if (intervalsNumber < 29) {
        fragment.append(BaseElement.createComponent('span', 'range-slider__scale-mark'));
      }

      if (intervalsNumber < 15) {
        fragment.append(BaseElement.createComponent('span', 'range-slider__scale-mark'));
      }

      if (intervalsNumber < 8) {
        fragment.append(BaseElement.createComponent('span', 'range-slider__scale-mark'));
      }

      if (intervalsNumber < 5) {
        fragment.append(BaseElement.createComponent('span', 'range-slider__scale-mark'));
      }

      item.append(fragment);
    });
  }

  private addValues(min: number, max: number, intervalsNumber: number): void {
    this.values[0] = min;
    const step = (max - min) / intervalsNumber;
    let numberOfDigitsAfterPoint = 0;

    if (Math.round(intervalsNumber / (max - min)) !== 0) {
      numberOfDigitsAfterPoint = (Math.round(intervalsNumber / (max - min))).toString().length;
    }

    for (let i = 1; i < intervalsNumber; i += 1) {
      this.values[i] = Number(((i * step) + min).toFixed(numberOfDigitsAfterPoint));
    }

    this.values.push(max);

    const valueElement = BaseElement.createComponent('span', 'range-slider__scale-interval-value range-slider__scale-interval-value_min');
    valueElement.textContent = `${this.values[0]}`;
    this.intervals[0].append(valueElement);
    this.valueElements.push(valueElement);

    for (let i = 1; i < this.values.length; i += 1) {
      const newValueElement = BaseElement.createComponent('span', 'range-slider__scale-interval-value');
      newValueElement.textContent = `${this.values[i]}`;
      this.intervals[i - 1].append(newValueElement);
      this.valueElements.push(newValueElement);
    }
  }

  private handleClick(event: MouseEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
      const x: number = event.clientX - event.currentTarget.getBoundingClientRect().left;
      const y: number = event.clientY - event.currentTarget.getBoundingClientRect().top;

      this.view.handleScaleOrTrackClick(x, y);
    }
  }

  private attachEventHandlers(): void {
    this.component.addEventListener('click', this.handleClick.bind(this));
  }
}

export default Scale;
