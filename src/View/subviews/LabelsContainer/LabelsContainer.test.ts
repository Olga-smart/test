import LabelsContainer from './LabelsContainer';

describe('LabelsContainer', () => {
  describe('constructor()', () => {
    const labelsContainer = new LabelsContainer();

    it('component property is div element', () => {
      expect(labelsContainer.getComponent()).toBeInstanceOf(HTMLDivElement);
    });

    it('component has necessary class', () => {
      expect(labelsContainer.getComponent().classList).toContain('range-slider__labels-container');
    });
  });

  describe('append(...elements)', () => {
    afterAll(() => {
      jest.restoreAllMocks();
    });

    const labelsContainer = new LabelsContainer();
    const div = document.createElement('div');
    jest.spyOn(HTMLElement.prototype, 'append');
    labelsContainer.append(div);

    it('append element to component', () => {
      expect(div.parentNode).toBe(labelsContainer.getComponent());
    });

    it('call built-in method append', () => {
      expect(labelsContainer.getComponent().append).toBeCalledWith(div);
    });

    it('work with multiple arguments', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      labelsContainer.append(div1, div2, div3);

      expect(labelsContainer.getComponent().append).toBeCalledWith(div1, div2, div3);
    });
  });

  describe('fixWidthForVertical(labels, indent)', () => {
    const labelsContainer = new LabelsContainer();
    const label1 = {
      offsetWidth: 10,
    };
    const label2 = {
      offsetWidth: 20,
    };
    const label3 = {
      offsetWidth: 30,
    };

    it('set up padding equal to max label width + indent', () => {
      for (let i = 4; i <= 10; i += 1) {
        // 'as HTMLElement[]' is necessary to test offsetWidth'
        labelsContainer.fixWidthForVertical([label1, label2, label3] as HTMLElement[], i);
        expect(labelsContainer.getComponent().style.paddingLeft).toBe(`${30 + i}px`);
      }
    });
  });

  describe('fixHeightForHorizontal(labels, indent)', () => {
    const labelsContainer = new LabelsContainer();
    const label1 = {
      offsetHeight: 10,
    };
    const label2 = {
      offsetHeight: 20,
    };
    const label3 = {
      offsetHeight: 30,
    };

    it('set up padding equal to max label width + indent', () => {
      for (let i = 4; i <= 10; i += 1) {
        // 'as HTMLElement[]' is necessary to test offsetHeight'
        labelsContainer.fixHeightForHorizontal([label1, label2, label3] as HTMLElement[], i);
        expect(labelsContainer.getComponent().style.paddingTop).toBe(`${30 + i}px`);
      }
    });
  });
});
