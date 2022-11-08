import { Slider } from './Slider';

describe('Slider', () => {
  const defaultSliderOptions = {
    min: 0,
    max: 100,
    leftValue: 25,
    rightValue: 75,
    range: true,
    step: 1,
    minMaxLabels: true,
    valueLabels: true,
    vertical: false,
    scale: false,
    scaleIntervals: 4,
    panel: false,
  };

  describe('inform(eventType)', () => {
    describe('if eventType is "modelLeftSet"', () => {
      it('call onChange method with left anf right values as parameters, if it is defined', () => {
        const element = document.createElement('div');
        const slider = new Slider(element, defaultSliderOptions);
        slider.onChange = jest.fn();
        slider.inform('modelLeftSet');

        expect(slider.onChange).toBeCalledWith(25, 75);
      });
    });

    describe('if eventType is "modelRightSet"', () => {
      it('call onChange method with left anf right values as parameters, if it is defined', () => {
        const element = document.createElement('div');
        const slider = new Slider(element, defaultSliderOptions);
        slider.onChange = jest.fn();
        slider.inform('modelRightSet');

        expect(slider.onChange).toBeCalledWith(25, 75);
      });
    });
  });

  describe('setLeftValue(value)', () => {
    const element = document.createElement('div');
    const slider = new Slider(element, defaultSliderOptions);
    slider.setLeftValue(50);

    it('change left value', () => {
      const leftValueLabel = element.querySelector('.range-slider__value-label_left');
      expect(leftValueLabel?.textContent).toBe('50');
    });
  });

  describe('setRightValue(value)', () => {
    const element = document.createElement('div');
    const slider = new Slider(element, defaultSliderOptions);
    slider.setRightValue(50);

    it('change left value', () => {
      const rightValueLabel = element.querySelector('.range-slider__value-label_right');
      expect(rightValueLabel?.textContent).toBe('50');
    });
  });
});
