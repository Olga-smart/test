import Label from './Label';

describe('Label', () => {
  describe('setOpacity(value)', () => {
    const label = new Label();

    it('change opacity of component', () => {
      for (let i = 0; i <= 1; i += 0.1) {
        label.setOpacity(i);
        expect(label.getComponent().style.opacity).toBe(`${i}`);
      }
    });
  });

  describe('setValue(value)', () => {
    const label = new Label();

    it('change textContent of component', () => {
      for (let i = -50; i <= 50; i += 1) {
        label.setValue(i);
        expect(label.getValue()).toBe(i);
      }
    });
  });

  describe('getValue()', () => {
    const label = new Label();

    it('return textContent of component', () => {
      for (let i = -50; i <= 50; i += 1) {
        label.setValue(i);
        expect(label.getValue()).toBe(i);
      }
    });
  });

  describe('getLeftIndent()', () => {
    const label = new Label();

    it('return left indent of component', () => {
      for (let i = 0; i <= 100; i += 1) {
        label.setIndent('left', i);
        expect(label.getLeftIndent()).toBe(`${i}%`);
      }
    });
  });

  describe('getTopIndent()', () => {
    const label = new Label();

    it('return top indent of component', () => {
      for (let i = 0; i <= 100; i += 1) {
        label.setIndent('top', i);
        expect(label.getTopIndent()).toBe(`${i}%`);
      }
    });
  });
});
