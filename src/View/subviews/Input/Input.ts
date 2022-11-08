import BaseElement from '../../BaseElement/BaseElement';

class Input extends BaseElement<'input'> {
  constructor() {
    super('input', 'range-slider__input');
    this.setAttributes();
  }

  setValue(value1: number, value2: number | null = null): void {
    if (value2 === null) {
      this.component.value = `${value1}`;
    } else {
      this.component.value = `${value1} - ${value2}`;
    }
  }

  private setAttributes(): void {
    this.component.type = 'text';
    this.component.tabIndex = -1;
    this.component.readOnly = true;
  }
}

export default Input;
