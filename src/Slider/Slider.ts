import Model from '../Model/Model';
import View from '../View/View';
import Presenter from '../Presenter/Presenter';

type SliderOptions = {
  min: number,
  max: number,
  leftValue: number,
  rightValue: number,
  range: boolean,
  step: number,
  minMaxLabels: boolean,
  valueLabels: boolean,
  vertical: boolean,
  scale: boolean,
  scaleIntervals: number,
  panel: boolean,
};

class Slider {
  private model: Model;

  private view: View;

  private presenter: Presenter;

  constructor(element: HTMLDivElement, options: SliderOptions) {
    this.model = new Model({
      min: options.min,
      max: options.max,
      leftValue: options.leftValue,
      rightValue: options.rightValue,
      range: options.range,
      step: options.step,
    });
    this.view = new View(element, {
      minMaxLabels: options.minMaxLabels,
      valueLabels: options.valueLabels,
      vertical: options.vertical,
      range: options.range,
      scale: options.scale,
      scaleIntervals: options.scaleIntervals,
      panel: options.panel,
    });
    this.presenter = new Presenter(this.model, this.view);

    this.model.subscribe(this);
  }

  inform(eventType: string): void {
    switch (eventType) {
      case 'modelLeftSet':
        if (this.onChange) {
          this.onChange(this.model.getLeftValue(), this.model.getRightValue());
        }
        break;
      case 'modelRightSet':
        if (this.onChange) {
          this.onChange(this.model.getLeftValue(), this.model.getRightValue());
        }
        break;

      default:
        break;
    }
  }

  setLeftValue(value: number): this {
    this.presenter.inform('viewSetLeftFromOutside', value);
    return this;
  }

  setRightValue(value: number): this {
    this.presenter.inform('viewSetRightFromOutside', value);
    return this;
  }

  setStep(value: number): this {
    this.presenter.inform('viewSetStep', value);
    return this;
  }

  onChange?: (leftValue: number, rightValue: number | undefined) => void;
}

export { Slider, SliderOptions };
