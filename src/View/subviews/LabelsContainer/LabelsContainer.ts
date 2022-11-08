import BaseElement from '../../BaseElement/BaseElement';

class LabelsContainer extends BaseElement<'div'> {
  constructor() {
    super('div', 'range-slider__labels-container');
  }

  append(...elements: HTMLElement[]): void {
    this.component.append(...elements);
  }

  fixWidthForVertical(labels: HTMLElement[], indent: number = 4): void {
    let maxWidth = 0;

    labels.forEach((label) => {
      if (label.offsetWidth > maxWidth) {
        maxWidth = label.offsetWidth;
      }
    });

    this.component.style.paddingLeft = `${maxWidth + indent}px`;
  }

  fixHeightForHorizontal(labels: HTMLElement[], indent: number = 4): void {
    let maxHeight = 0;

    labels.forEach((label) => {
      if (label.offsetHeight > maxHeight) {
        maxHeight = label.offsetHeight;
      }
    });

    this.component.style.paddingTop = `${maxHeight + indent}px`;
  }
}

export default LabelsContainer;
