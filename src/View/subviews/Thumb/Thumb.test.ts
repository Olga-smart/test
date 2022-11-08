import Thumb from './Thumb';
import View from '../../View';

describe('Thumb', () => {
  describe('constructor(type)', () => {
    describe('set up component property with necessary classes', () => {
      it('common class', () => {
        const slider = document.createElement('div');
        const view = new View(slider);
        const thumb = new Thumb(view);
        expect(thumb.getComponent().classList).toContain('range-slider__thumb');
      });

      it('class for left thumb if argument "type" == "left" or by default', () => {
        const slider = document.createElement('div');
        const view = new View(slider);
        let thumb = new Thumb(view);
        expect(thumb.getComponent().classList).toContain('range-slider__thumb_left');

        thumb = new Thumb(view, 'left');
        expect(thumb.getComponent().classList).toContain('range-slider__thumb_left');
      });

      it('class for right thumb if argument "type" == "right"', () => {
        const slider = document.createElement('div');
        const view = new View(slider);
        const thumb = new Thumb(view, 'right');
        expect(thumb.getComponent().classList).toContain('range-slider__thumb_right');
      });

      it('component property is div element', () => {
        const slider = document.createElement('div');
        const view = new View(slider);
        const thumb = new Thumb(view);
        expect(thumb.getComponent()).toBeInstanceOf(HTMLDivElement);
      });
    });
  });

  describe('getLeftIndent()', () => {
    const slider = document.createElement('div');
    const view = new View(slider);
    const thumb = new Thumb(view);

    it('return left property of component', () => {
      for (let i = 0; i <= 100; i += 1) {
        thumb.setIndent('left', i);
        expect(thumb.getLeftIndent()).toBe(`${i}%`);
      }
    });
  });

  describe('getTopIndent()', () => {
    const slider = document.createElement('div');
    const view = new View(slider);
    const thumb = new Thumb(view);

    it('return top property of component', () => {
      for (let i = 0; i <= 100; i += 1) {
        thumb.setIndent('top', i);
        expect(thumb.getTopIndent()).toBe(`${i}%`);
      }
    });
  });

  describe('setZIndex(value)', () => {
    const slider = document.createElement('div');
    const view = new View(slider);
    const thumb = new Thumb(view);

    it('change z-index of component', () => {
      for (let i = 0; i <= 100; i += 1) {
        thumb.setZIndex(i);
        expect(thumb.getComponent().style.zIndex).toBe(`${i}`);
      }
    });
  });

  describe('handle events', () => {
    const slider = document.createElement('div');
    const view = new View(slider);
    const thumb = new Thumb(view);

    it('handle pointerover', () => {
      const event = new Event('pointerover');
      thumb.getComponent().dispatchEvent(event);

      expect(thumb.getComponent().classList).toContain('range-slider__thumb_hover');
    });

    it('handle pointerout', () => {
      const event = new Event('pointerout');
      thumb.getComponent().classList.add('range-slider__thumb_hover');
      thumb.getComponent().dispatchEvent(event);

      expect(thumb.getComponent().classList).not.toContain('range-slider__thumb_hover');
    });

    it('handle pointerdown', () => {
      const event = new Event('pointerdown');
      thumb.getComponent().setPointerCapture = jest.fn();
      thumb.getComponent().dispatchEvent(event);

      expect(thumb.getComponent().classList).toContain('range-slider__thumb_active');
    });

    it('handle pointerup', () => {
      const event = new Event('pointerup');
      thumb.getComponent().classList.add('range-slider__thumb_active');
      thumb.getComponent().dispatchEvent(event);

      expect(thumb.getComponent().classList).not.toContain('range-slider__thumb_active');
    });

    describe('handle dragging', () => {
      it('call handler for left input if thumb type is left', () => {
        const newThumb = new Thumb(view, 'left');
        view.handleLeftInput = jest.fn();
        newThumb.getComponent().setPointerCapture = jest.fn();

        newThumb.getComponent().dispatchEvent(new Event('pointerdown'));
        newThumb.getComponent().dispatchEvent(new Event('pointermove'));

        expect(view.handleLeftInput).toBeCalled();
      });

      it('call handler for right input if thumb type is right', () => {
        const newThumb = new Thumb(view, 'right');
        view.handleRightInput = jest.fn();
        newThumb.getComponent().setPointerCapture = jest.fn();

        newThumb.getComponent().dispatchEvent(new Event('pointerdown'));
        newThumb.getComponent().dispatchEvent(new Event('pointermove'));

        expect(view.handleRightInput).toBeCalled();
      });
    });
  });
});
