import Range from './Range';

describe('Range', () => {
  describe('constructor()', () => {
    describe('set up component property with necessary classes', () => {
      const range = new Range();

      it('common class', () => {
        expect(range.getComponent().classList).toContain('range-slider__range');
      });

      it('component property is div element', () => {
        expect(range.getComponent()).toBeInstanceOf(HTMLDivElement);
      });
    });
  });

  describe('setWidth(percent)', () => {
    const range = new Range();

    it('set up width property of component', () => {
      for (let i = 0; i <= 100; i += 1) {
        range.setWidth(i);
        expect(range.getComponent().style.width).toBe(`${i}%`);
      }
    });
  });

  describe('setHeight(percent)', () => {
    const range = new Range();

    it('set up height property of component', () => {
      for (let i = 0; i <= 100; i += 1) {
        range.setHeight(i);
        expect(range.getComponent().style.height).toBe(`${i}%`);
      }
    });
  });

  describe('resetWidth()', () => {
    const range = new Range();

    it('reset width property of component', () => {
      range.resetWidth();
      expect(range.getComponent().style.width).toBe('');
    });
  });

  describe('resetHeight()', () => {
    const range = new Range();

    it('reset height property of component', () => {
      range.resetHeight();
      expect(range.getComponent().style.height).toBe('');
    });
  });

  describe('resetTopIndent()', () => {
    const range = new Range();

    it('reset top property of component', () => {
      range.resetTopIndent();
      expect(range.getComponent().style.top).toBe('');
    });
  });
});
