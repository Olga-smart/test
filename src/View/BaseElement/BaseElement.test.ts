/* eslint-disable max-classes-per-file */ // it is necessary for createComponent testing
import BaseElement from './BaseElement';

describe('BaseElement', () => {
  describe('constructor(tag, className)', () => {
    it('create element with passed tag', () => {
      const tags: (keyof HTMLElementTagNameMap)[] = ['div', 'span', 'a', 'h1', 'input'];
      tags.forEach((tag) => {
        const element = new BaseElement(tag);
        expect(element.getComponent().tagName).toBe(tag.toUpperCase());
      });
    });

    it('assign passed class name to element', () => {
      const classNames = ['class1', 'class2 class3', 'class4-class5'];
      classNames.forEach((className) => {
        const element = new BaseElement('div', className);
        expect(element.getComponent().className).toBe(className);
      });
    });
  });

  describe('createComponent(tag, className)', () => {
    it('create element with passed tag', () => {
      const tags: (keyof HTMLElementTagNameMap)[] = ['div', 'span', 'a', 'h1', 'input'];
      tags.forEach((tag) => {
        class Element extends BaseElement<'div'> {
          element: HTMLElement;

          constructor() {
            super('div');
            this.element = BaseElement.createComponent(tag);
          }
        }
        const element = new Element();

        expect(element.element.tagName).toBe(tag.toUpperCase());
      });
    });

    it('assign passed class name to element', () => {
      const classNames = ['class1', 'class2 class3', 'class4-class5'];
      classNames.forEach((className) => {
        class Element extends BaseElement<'div'> {
          element: HTMLElement;

          constructor() {
            super('div');
            this.element = BaseElement.createComponent('div', className);
          }
        }
        const element = new Element();

        expect(element.element.className).toBe(className);
      });
    });
  });

  describe('getComponent()', () => {
    it('return HTML element', () => {
      const element = new BaseElement('div');

      expect(element.getComponent()).toBeInstanceOf(HTMLElement);
    });
  });

  describe('getBoundingClientRect()', () => {
    it('return component coordinates', () => {
      const element = new BaseElement('div');
      const coords = element.getBoundingClientRect();

      expect(coords).toEqual(element.getComponent().getBoundingClientRect());
    });
  });

  describe('getWidth()', () => {
    it('return component width', () => {
      const element = new BaseElement('div');
      const width = element.getWidth();

      expect(width).toBe(element.getComponent().offsetWidth);
    });
  });

  describe('getHeight()', () => {
    const element = new BaseElement('div');
    const height = element.getHeight();

    it('return component height', () => {
      expect(height).toBe(element.getComponent().offsetHeight);
    });
  });

  describe('setIndent(side, indent)', () => {
    const element = new BaseElement('div');
    type Side = 'top' | 'right' | 'bottom' | 'left';
    const sides: Side[] = ['top', 'right', 'bottom', 'left'];

    it('if indent is number, set indent in %', () => {
      sides.forEach((side) => {
        for (let i = 0; i <= 100; i += 1) {
          element.setIndent(side, i);
          expect(element.getComponent().style[side]).toBe(`${i}%`);
        }
      });
    });

    it('if indent is string, set indent as it is', () => {
      sides.forEach((side) => {
        for (let i = 0; i <= 100; i += 1) {
          element.setIndent(side, `${i}px`);
          expect(element.getComponent().style[side]).toBe(`${i}px`);
        }
      });
    });
  });

  describe('remove()', () => {
    it('remove component from DOM', () => {
      const element = new BaseElement('div');
      const container = document.createElement('div');
      container.append(element.getComponent());

      expect(container.children).toContain(element.getComponent());

      element.remove();

      expect(container.children).not.toContain(element.getComponent());
    });
  });
});
