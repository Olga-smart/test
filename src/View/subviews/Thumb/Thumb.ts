import BaseElement from '../../BaseElement/BaseElement';

type ViewForThumb = {
  handleLeftInput(clientX: number, clientY: number, shiftX: number, shiftY: number): void,
  handleRightInput(clientX: number, clientY: number, shiftX: number, shiftY: number): void,
};

class Thumb extends BaseElement<'div'> {
  private type: 'left' | 'right';

  private view: ViewForThumb;

  constructor(view: ViewForThumb, type: 'left' | 'right' = 'left') {
    super('div', `range-slider__thumb range-slider__thumb_${type}`);

    this.type = type;
    this.view = view;

    this.attachEventHandlers();
  }

  getLeftIndent(): string {
    return this.component.style.left;
  }

  getTopIndent(): string {
    return this.component.style.top;
  }

  setZIndex(value: number): void {
    this.component.style.zIndex = `${value}`;
  }

  private static handlePointerOver(event: PointerEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.add('range-slider__thumb_hover');
    }
  }

  private static handlePointerOut(event: PointerEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.remove('range-slider__thumb_hover');
    }
  }

  private static handlePointerUp(event: PointerEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.remove('range-slider__thumb_active');
    }
  }

  private static handleDragStart(): false {
    return false;
  }

  private handlePointerDown(event: PointerEvent): void {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.add('range-slider__thumb_active');

      event.currentTarget.setPointerCapture(event.pointerId);

      // prevent selection (browser action)
      event.preventDefault();

      const shiftX: number = event.clientX - event.currentTarget.getBoundingClientRect().left;
      const shiftY: number = event.clientY - event.currentTarget.getBoundingClientRect().top;

      const handlePointerMove = (newEvent: PointerEvent) => {
        if (this.type === 'left') {
          this.view.handleLeftInput(newEvent.clientX, newEvent.clientY, shiftX, shiftY);
        }

        if (this.type === 'right') {
          this.view.handleRightInput(newEvent.clientX, newEvent.clientY, shiftX, shiftY);
        }
      };

      const handlePointerUp = () => {
        this.component.removeEventListener('pointermove', handlePointerMove);
        this.component.removeEventListener('pointerup', handlePointerUp);
      };

      this.component.addEventListener('pointermove', handlePointerMove);
      this.component.addEventListener('pointerup', handlePointerUp);
    }
  }

  private attachEventHandlers(): void {
    this.component.addEventListener('pointerover', Thumb.handlePointerOver);
    this.component.addEventListener('pointerout', Thumb.handlePointerOut);
    this.component.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.component.addEventListener('pointerup', Thumb.handlePointerUp);
    this.component.addEventListener('dragstart', Thumb.handleDragStart);
  }
}

export default Thumb;
