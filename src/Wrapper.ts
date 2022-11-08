import 'airbnb-browser-shims';

import { Slider, SliderOptions } from './Slider/Slider';
import './style.scss';

declare global {
  interface JQuery {
    rangeSlider: IRangeSlider;
  }

  interface IRangeSlider {
    (options?: object): JQuery<HTMLElement>;
  }
}

(function Wrapper(jQ) {
  const $ = jQ;

  const defaults: Readonly<SliderOptions> = {
    min: 0,
    max: 100,
    range: true,
    leftValue: 25,
    rightValue: 75,
    step: 1,
    minMaxLabels: true,
    valueLabels: true,
    vertical: false,
    scale: false,
    scaleIntervals: 5,
    panel: false,
  };

  $.fn.rangeSlider = function initSliders(options: Partial<SliderOptions> = {}): JQuery {
    return this.each(function initSlider() {
      const settingsFromDataset: Partial<SliderOptions> = {
        min: $(this).data('min'),
        max: $(this).data('max'),
        range: $(this).data('range'),
        leftValue: $(this).data('leftValue'),
        rightValue: $(this).data('rightValue'),
        step: $(this).data('step'),
        minMaxLabels: $(this).data('minMaxLabels'),
        valueLabels: $(this).data('valueLabels'),
        vertical: $(this).data('vertical'),
        scale: $(this).data('scale'),
        scaleIntervals: $(this).data('scaleIntervals'),
        panel: $(this).data('panel'),
      };

      function validate(settings: SliderOptions): SliderOptions {
        let fixedSettings: SliderOptions = $.extend({}, settings);

        function removeWrongTypes(): void {
          function checkType(property: keyof SliderOptions): void {
            if (typeof settings[property] !== typeof defaults[property]) {
              delete fixedSettings[property];
            }
          }

          /* There is no Object.keys().forEach because TS throws an error:
           * "Type 'string[]' is not assignable to type 'keyof RangeSliderOptions[]'" */
          checkType('min');
          checkType('max');
          checkType('leftValue');
          checkType('rightValue');
          checkType('range');
          checkType('step');
          checkType('minMaxLabels');
          checkType('valueLabels');
          checkType('vertical');
          checkType('scale');
          checkType('scaleIntervals');
          checkType('panel');
        }

        function mergeWithDefaults(): void {
          fixedSettings = $.extend({}, defaults, fixedSettings);
        }

        function fixValues(): void {
          if (fixedSettings.min > fixedSettings.max) {
            [fixedSettings.min, fixedSettings.max] = [fixedSettings.max, fixedSettings.min];
          }

          if (fixedSettings.leftValue < fixedSettings.min) {
            fixedSettings.leftValue = fixedSettings.min;
          }

          if (fixedSettings.rightValue > fixedSettings.max) {
            fixedSettings.rightValue = fixedSettings.max;
          }

          if (fixedSettings.leftValue > fixedSettings.max) {
            fixedSettings.leftValue = fixedSettings.max;
          }

          if (fixedSettings.leftValue > fixedSettings.rightValue) {
            [fixedSettings.leftValue, fixedSettings.rightValue] = (
              [fixedSettings.rightValue, fixedSettings.leftValue]
            );
          }

          if (fixedSettings.step > Math.abs(fixedSettings.max - fixedSettings.min)) {
            fixedSettings.step = Math.abs(fixedSettings.max - fixedSettings.min);
          }

          if (fixedSettings.scaleIntervals < 1) {
            fixedSettings.scaleIntervals = 1;
          }

          if (Number.isInteger(fixedSettings.scaleIntervals)) {
            fixedSettings.scaleIntervals = Math.floor(fixedSettings.scaleIntervals);
          }
        }

        removeWrongTypes();
        mergeWithDefaults();
        fixValues();

        return fixedSettings;
      }

      let settings: SliderOptions = $.extend({}, defaults, options, settingsFromDataset);
      settings = validate(settings);

      if (this instanceof HTMLDivElement) {
        $(this).data('rangeSlider', new Slider(this, settings));
      }
    });
  };
}(jQuery));
