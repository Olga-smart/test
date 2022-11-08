import Track from './Track';
import View from '../../View';

describe('Track', () => {
  describe('constructor()', () => {
    const slider = document.createElement('div');
    const view = new View(slider);
    const track = new Track(view);

    describe('set up component property with necessary classes', () => {
      it('common class', () => {
        expect(track.getComponent().classList).toContain('range-slider__track');
      });

      it('component property is div element', () => {
        expect(track.getComponent()).toBeInstanceOf(HTMLDivElement);
      });
    });

    it('set up view property', () => {
      expect(track).toHaveProperty('view');
    });
  });

  describe('append(...elements)', () => {
    const slider = document.createElement('div');
    const view = new View(slider);
    const track = new Track(view);
    const div = document.createElement('div');
    jest.spyOn(HTMLElement.prototype, 'append');
    track.append(div);

    it('append element to component', () => {
      expect(div.parentNode).toBe(track.getComponent());
    });

    it('call built-in method append', () => {
      expect(track.getComponent().append).toBeCalledWith(div);
    });

    it('work with multiple arguments', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');
      track.append(div1, div2, div3);

      expect(track.getComponent().append).toBeCalledWith(div1, div2, div3);
    });
  });

  describe('handle events', () => {
    it('handle click', () => {
      const slider = document.createElement('div');
      const view = new View(slider);
      const track = new Track(view);
      view.handleScaleOrTrackClick = jest.fn();
      const event = new MouseEvent('click');
      track.getComponent().dispatchEvent(event);

      const x = event.clientX - track.getBoundingClientRect().left;
      const y = event.clientY - track.getBoundingClientRect().top;

      expect(view.handleScaleOrTrackClick).toBeCalledWith(x, y);
    });
  });
});
