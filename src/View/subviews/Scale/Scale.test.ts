import Scale from './Scale';
import View from '../../View';

describe('Scale', () => {
  describe('constructor(min, max, intervalsNumber)', () => {
    it('set up component property with necessary class', () => {
      const slider = document.createElement('div');
      const view = new View(slider, {
        scale: true,
      });
      const scale = new Scale(0, 150, view);
      expect(scale.getComponent().classList).toContain('range-slider__scale');
    });

    describe('create intervals', () => {
      it('create right amount of elements and append them to component', () => {
        const slider = document.createElement('div');
        for (let i = 1; i <= 20; i += 1) {
          const view = new View(slider, {
            scale: true,
            scaleIntervals: i,
          });
          const scale = new Scale(0, 150, view);
          expect(scale.getComponent().querySelectorAll('.range-slider__scale-interval')).toHaveLength(i);
        }
      });
    });

    describe('add marks in intervals', () => {
      const slider = document.createElement('div');

      it('if intervalsNumber < 5, add 4 marks', () => {
        for (let i = 1; i < 5; i += 1) {
          const view = new View(slider, {
            scale: true,
            scaleIntervals: i,
          });
          const scale = new Scale(0, 150, view);
          expect(scale.getComponent().querySelectorAll('.range-slider__scale-mark')).toHaveLength(i * 4);
        }
      });

      it('if intervalsNumber > 4 and < 8, add 3 marks', () => {
        for (let i = 5; i < 8; i += 1) {
          const view = new View(slider, {
            scale: true,
            scaleIntervals: i,
          });
          const scale = new Scale(0, 150, view);
          expect(scale.getComponent().querySelectorAll('.range-slider__scale-mark')).toHaveLength(i * 3);
        }
      });

      it('if intervalsNumber > 7 and < 15, add 2 marks', () => {
        for (let i = 8; i < 15; i += 1) {
          const view = new View(slider, {
            scale: true,
            scaleIntervals: i,
          });
          const scale = new Scale(0, 150, view);
          expect(scale.getComponent().querySelectorAll('.range-slider__scale-mark')).toHaveLength(i * 2);
        }
      });

      it('if intervalsNumber > 14 and < 29, add 1 mark', () => {
        for (let i = 15; i < 29; i += 1) {
          const view = new View(slider, {
            scale: true,
            scaleIntervals: i,
          });
          const scale = new Scale(0, 150, view);
          expect(scale.getComponent().querySelectorAll('.range-slider__scale-mark')).toHaveLength(i);
        }
      });

      it('if intervalsNumber > 28, add no marks', () => {
        const view = new View(slider, {
          scale: true,
          scaleIntervals: 29,
        });
        const scale = new Scale(0, 150, view);
        expect(scale.getComponent().querySelectorAll('.range-slider__scale-mark')).toHaveLength(0);
      });
    });

    describe('add values', () => {
      const slider = document.createElement('div');

      it('values length is 1 more than intervals length', () => {
        for (let i = 1; i <= 10; i += 1) {
          const view = new View(slider, {
            scale: true,
            scaleIntervals: i,
          });
          const scale = new Scale(0, 150, view);
          expect(scale.getComponent().querySelectorAll('.range-slider__scale-interval-value')).toHaveLength(i + 1);
        }
      });

      it('first value is min', () => {
        for (let i = -10; i <= 10; i += 1) {
          const view = new View(slider, {
            scale: true,
          });
          const scale = new Scale(i, 150, view);
          expect(scale.getComponent().querySelector('.range-slider__scale-interval-value_min')?.textContent).toBe(`${i}`);
        }
      });

      it('last value is max', () => {
        for (let i = -10; i <= 10; i += 1) {
          const view = new View(slider, {
            scale: true,
          });
          const scale = new Scale(-20, i, view);
          const valuesCollection = scale.getComponent().querySelectorAll('.range-slider__scale-interval-value');
          expect(valuesCollection[valuesCollection.length - 1].textContent).toBe(`${i}`);
        }
      });
    });
  });

  describe('fitWidthForVertical()', () => {
    const slider = document.createElement('div');
    const view = new View(slider, {
      scale: true,
    });
    const scale = new Scale(0, 150, view);

    const valueElements: NodeListOf<HTMLDivElement> = scale.getComponent().querySelectorAll('.range-slider__scale-interval-value');
    valueElements[0].style.width = '100px';
    valueElements[1].style.width = '200px';
    valueElements[2].style.width = '300px';

    Object.defineProperties(window.HTMLElement.prototype, {
      offsetWidth: {
        get() {
          return parseInt(this.style.width, 10);
        },
      },
    });

    it('set up component padding right equal to width of valueElement with max width + 3px by default', () => {
      scale.fitWidthForVertical();
      expect(scale.getComponent().style.paddingRight).toBe('303px');
    });

    it('set up component padding right equal to width of valueElement with max width + indent, passed to method', () => {
      for (let i = 1; i <= 10; i += 1) {
        scale.fitWidthForVertical(i);
        expect(scale.getComponent().style.paddingRight).toBe(`${300 + i}px`);
      }
    });
  });

  describe('fitHeightForHorizontal()', () => {
    const slider = document.createElement('div');
    const view = new View(slider, {
      scale: true,
    });
    const scale = new Scale(0, 150, view);

    const valueElements: NodeListOf<HTMLDivElement> = scale.getComponent().querySelectorAll('.range-slider__scale-interval-value');
    valueElements[0].style.height = '100px';
    valueElements[1].style.height = '200px';
    valueElements[2].style.height = '300px';

    Object.defineProperties(window.HTMLElement.prototype, {
      offsetHeight: {
        get() {
          return parseInt(this.style.height, 10);
        },
      },
    });

    it('set up component padding bottom equal to height of valueElement with max height + 3px by default', () => {
      scale.fitHeightForHorizontal();
      expect(scale.getComponent().style.paddingBottom).toBe('303px');
    });

    it('set up component padding bottom equal to height of valueElement with max height + indent, passed to method', () => {
      for (let i = 1; i <= 10; i += 1) {
        scale.fitHeightForHorizontal(i);
        expect(scale.getComponent().style.paddingBottom).toBe(`${300 + i}px`);
      }
    });
  });

  describe('handleSwitchFromHorizontalToVertical()', () => {
    const slider = document.createElement('div');
    const view = new View(slider, {
      scale: true,
    });
    const scale = new Scale(0, 150, view);
    scale.fitWidthForVertical = jest.fn();
    scale.handleSwitchFromHorizontalToVertical();

    it('reset bottom padding', () => {
      expect(scale.getComponent().style.paddingBottom).toBe('');
    });

    it('fit width', () => {
      expect(scale.fitWidthForVertical).toBeCalled();
    });
  });

  describe('handleSwitchFromVerticalToHorizontal()', () => {
    const slider = document.createElement('div');
    const view = new View(slider, {
      scale: true,
    });
    const scale = new Scale(0, 150, view);
    scale.fitHeightForHorizontal = jest.fn();
    scale.handleSwitchFromVerticalToHorizontal();

    it('reset right padding', () => {
      expect(scale.getComponent().style.paddingRight).toBe('');
    });

    it('fit width', () => {
      expect(scale.fitHeightForHorizontal).toBeCalled();
    });
  });

  describe('handle events', () => {
    it('handle click', () => {
      const slider = document.createElement('div');
      const view = new View(slider, {
        scale: true,
      });
      const scale = new Scale(0, 150, view);
      view.handleScaleOrTrackClick = jest.fn();
      const event = new Event('click');

      scale.getComponent().dispatchEvent(event);

      expect(view.handleScaleOrTrackClick).toBeCalled();
    });
  });
});
