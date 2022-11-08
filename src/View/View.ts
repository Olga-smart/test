import BaseElement from './BaseElement/BaseElement';
import Track from './subviews/Track/Track';
import Range from './subviews/Range/Range';
import Thumb from './subviews/Thumb/Thumb';
import Scale from './subviews/Scale/Scale';
import LabelsContainer from './subviews/LabelsContainer/LabelsContainer';
import Label from './subviews/Label/Label';
import Input from './subviews/Input/Input';
import { Panel, PanelOptions } from './subviews/Panel/Panel';
import { EventManager, IEventListener } from '../EventManager/EventManager';

type ViewOptions = {
  minMaxLabels?: boolean,
  valueLabels?: boolean,
  vertical?: boolean,
  range?: boolean,
  scale?: boolean,
  scaleIntervals?: number,
  panel?: boolean
};

class View extends BaseElement<'div'> {
  private eventManager: EventManager;

  private slider: HTMLDivElement;

  private track: Track;

  private range: Range;

  private input: Input;

  private thumbLeft: Thumb;

  private thumbRight?: Thumb;

  private scale?: Scale;

  private scaleIntervals: number;

  private minLabel?: Label;

  private maxLabel?: Label;

  private valueLabelLeft?: Label;

  private valueLabelRight?: Label;

  private valueLabelCommon?: Label;

  private vertical?: boolean;

  private labelsContainer?: LabelsContainer;

  private panel?: Panel;

  constructor(component: HTMLDivElement, options: ViewOptions = {}) {
    super('div');

    this.component = component;
    this.eventManager = new EventManager();

    this.slider = BaseElement.createComponent('div', 'range-slider__slider');
    this.track = new Track(this);
    this.range = new Range();

    this.thumbLeft = new Thumb(this, 'left');

    this.input = new Input();

    if (options.range) {
      this.thumbRight = new Thumb(this, 'right');
    }

    // this field is always initialized in case the toggleScaleFromOutside() method will be called
    this.scaleIntervals = options.scaleIntervals ?? 4;

    if (options.scale) {
      /* create scale with arbitrary values, which will be replaced later by Presenter
       * it is necessary for hasScale() return true */
      this.scale = new Scale(0, 100, this);
    }

    if (options.minMaxLabels || options.valueLabels) {
      this.labelsContainer = new LabelsContainer();

      if (options.minMaxLabels) {
        this.minLabel = new Label('range-slider__min-max-label range-slider__min-max-label_left');
        this.maxLabel = new Label('range-slider__min-max-label range-slider__min-max-label_right');
      }

      if (options.valueLabels) {
        this.valueLabelLeft = new Label('range-slider__value-label range-slider__value-label_left');

        if (options.range) {
          this.valueLabelRight = new Label('range-slider__value-label range-slider__value-label_right');
          this.valueLabelCommon = new Label('range-slider__value-label range-slider__value-label_common');
        }
      }
    }

    if (options.vertical) {
      this.vertical = true;
    }

    if (options.panel) {
      this.panel = new Panel(this);
    }

    this.render();
  }

  subscribe(listener: IEventListener): void {
    this.eventManager.subscribe(listener);
  }

  setMinValue(min: number): void {
    this.minLabel?.setValue(min);
  }

  setMaxValue(max: number): void {
    this.maxLabel?.setValue(max);
  }

  setLeftValue(value: number, percent: number): void {
    if (!this.vertical) {
      this.thumbLeft.setIndent('left', percent);

      if (this.isRange()) {
        this.range.setIndent('left', percent);
      } else {
        this.range.setWidth(percent);
      }

      this.valueLabelLeft?.setIndent('left', `${percent}%`);

      this.thumbLeft.setZIndex(percent === 100 ? 100 : 3);
    }

    if (this.vertical) {
      this.thumbLeft.setIndent('top', 100 - percent);

      if (this.isRange()) {
        this.range.setIndent('bottom', percent);
      } else {
        this.range.setHeight(percent);
      }

      this.valueLabelLeft?.setIndent('top', `${100 - percent}%`);

      this.thumbLeft.setZIndex(percent === 100 ? 100 : 3);
    }

    if (this.valueLabelLeft) {
      this.valueLabelLeft.setValue(value);

      if (this.isRange()) {
        this.valueLabelCommon?.setValue(`${value} - ${this.valueLabelRight?.getValue()}`);

        if (this.isTwoValueLabelsClose()) {
          this.mergeLabels();
        } else {
          this.splitLabels();
        }
      }

      if (this.minLabel) {
        this.minLabel.setOpacity(this.isLeftValueLabelCloseToMinLabel() ? 0 : 1);

        if (!this.isRange()) {
          this.maxLabel?.setOpacity(this.isLeftValueLabelCloseToMaxLabel() ? 0 : 1);
        }
      }
    }
  }

  setRightValue(value: number, percent: number): void {
    if (!this.vertical) {
      this.thumbRight?.setIndent('left', percent);
      this.range.setIndent('right', 100 - percent);
      this.valueLabelRight?.setIndent('left', `${percent}%`);
    }

    if (this.vertical) {
      this.thumbRight?.setIndent('top', 100 - percent);
      this.range.setIndent('top', 100 - percent);
      this.valueLabelRight?.setIndent('top', `${100 - percent}%`);
    }

    if (this.valueLabelRight) {
      this.valueLabelRight.setValue(value);
      this.valueLabelCommon?.setValue(`${this.valueLabelLeft?.getValue()} - ${value}`);

      if (this.isTwoValueLabelsClose()) {
        this.mergeLabels();
      } else {
        this.splitLabels();
      }

      if (this.maxLabel) {
        this.maxLabel.setOpacity(this.isRightValueLabelCloseToMaxLabel() ? 0 : 1);
      }
    }
  }

  updateInput(value1: number, value2: number | null = null): void {
    this.input.setValue(value1, value2);
  }

  handleLeftInput(clientX: number, clientY: number, shiftX: number = 0, shiftY: number = 0): void {
    if (!this.vertical) {
      const trackShift = this.track.getBoundingClientRect().left;
      let newLeft = clientX - shiftX - trackShift;

      if (newLeft < 0) {
        newLeft = 0;
      }

      if (!this.isRange()) {
        const trackWidth = this.getTrackWidth();

        if (newLeft > trackWidth) {
          newLeft = trackWidth;
        }
      }

      if (this.isRange() && this.thumbRight) {
        const rightThumbShift = this.thumbRight.getBoundingClientRect().left;
        const rightThumbPosition = rightThumbShift + this.thumbRight.getWidth() / 2 - trackShift;

        if (newLeft > rightThumbPosition) {
          newLeft = rightThumbPosition;
        }
      }

      this.eventManager.notify('viewInputLeft', newLeft);
    }

    if (this.vertical) {
      const trackShift = this.track.getBoundingClientRect().top;
      let newTop = clientY - shiftY - trackShift;

      const trackHeight = this.getTrackHeight();
      if (newTop > trackHeight) {
        newTop = trackHeight;
      }

      if (!this.isRange() && newTop < 0) {
        newTop = 0;
      }

      if (this.isRange() && this.thumbRight) {
        const rightThumbShift = this.thumbRight.getBoundingClientRect().top;
        const rightThumbPosition = rightThumbShift + this.thumbRight.getHeight() / 2 - trackShift;

        if (newTop < rightThumbPosition) {
          newTop = rightThumbPosition;
        }
      }

      const newBottom = trackHeight - newTop;

      this.eventManager.notify('viewInputLeft', newBottom);
    }
  }

  handleRightInput(clientX: number, clientY: number, shiftX: number = 0, shiftY: number = 0): void {
    if (!this.vertical) {
      const trackShift = this.track.getBoundingClientRect().left;
      let newLeft = clientX - shiftX - trackShift;

      const leftThumbShift = this.thumbLeft.getBoundingClientRect().left;
      const leftThumbPosition = leftThumbShift + this.thumbLeft.getWidth() / 2 - trackShift;

      if (newLeft < leftThumbPosition) {
        newLeft = leftThumbPosition;
      }

      const trackWidth = this.getTrackWidth();
      if (newLeft > trackWidth) {
        newLeft = trackWidth;
      }

      this.eventManager.notify('viewInputRight', newLeft);
    }

    if (this.vertical) {
      const trackShift = this.track.getBoundingClientRect().top;
      let newTop = clientY - shiftY - trackShift;

      if (newTop < 0) {
        newTop = 0;
      }

      const leftThumbShift = this.thumbLeft.getBoundingClientRect().top;
      const leftThumbPosition = leftThumbShift + this.thumbLeft.getHeight() / 2 - trackShift;

      if (newTop > leftThumbPosition) {
        newTop = leftThumbPosition;
      }

      const newBottom = this.getTrackHeight() - newTop;

      this.eventManager.notify('viewInputRight', newBottom);
    }
  }

  addScale(min: number, max: number): void {
    this.scale = new Scale(min, max, this);
    this.slider.after(this.scale.getComponent());

    if (!this.vertical) {
      this.scale.fitHeightForHorizontal();
    }

    if (this.vertical) {
      this.scale.fitWidthForVertical();
    }
  }

  removeScale(): void {
    this.scale?.getComponent().remove();
    this.scale = undefined;
  }

  getScaleIntervals(): number {
    return this.scaleIntervals || 0;
  }

  handleScaleOrTrackClick(x: number, y: number): void {
    if (!this.isRange()) {
      this.addSmoothTransition('left');

      if (this.vertical) {
        this.eventManager.notify('viewInputLeft', this.getTrackHeight() - y);
      } else {
        this.eventManager.notify('viewInputLeft', x);
      }

      setTimeout(() => {
        this.removeSmoothTransition('left');
      }, 1000);
    }

    if (this.isRange()) {
      if (this.whichThumbIsNearer(x, y) === 'left') {
        this.addSmoothTransition('left');

        if (this.vertical) {
          this.eventManager.notify('viewInputLeft', this.getTrackHeight() - y);
        } else {
          this.eventManager.notify('viewInputLeft', x);
        }

        setTimeout(() => {
          this.removeSmoothTransition('left');
        }, 1000);
      } else {
        this.addSmoothTransition('right');

        if (this.vertical) {
          this.eventManager.notify('viewInputRight', this.getTrackHeight() - y);
        } else {
          this.eventManager.notify('viewInputRight', x);
        }

        setTimeout(() => {
          this.removeSmoothTransition('right');
        }, 1000);
      }
    }
  }

  fixLabelsContainerWidthForVertical(): void {
    const labels: HTMLElement[] = this.collectLabels();
    this.labelsContainer?.fixWidthForVertical(labels);
  }

  fixLabelsContainerHeightForHorizontal(): void {
    const labels: HTMLElement[] = this.collectLabels();
    this.labelsContainer?.fixHeightForHorizontal(labels);
  }

  setPanelValues(options: PanelOptions): void {
    this.panel?.setValues(options);
  }

  updatePanelFrom(value: number): void {
    this.panel?.updateFrom(value);
  }

  updatePanelTo(value: number | ''): void {
    this.panel?.updateTo(value);
  }

  updatePanelScaleIntervals(value: number | ''): void {
    this.panel?.updateScaleIntervals(value);
  }

  updatePanelStep(value: number): void {
    this.panel?.updateStep(value);
  }

  updatePanelMin(value: number): void {
    this.panel?.updateMin(value);
  }

  updatePanelMax(value: number): void {
    this.panel?.updateMax(value);
  }

  setLeftFromOutside(value: number): void {
    this.eventManager.notify('viewSetLeftFromOutside', value);
  }

  setRightFromOutside(value: number): void {
    this.eventManager.notify('viewSetRightFromOutside', value);
  }

  setMinFromOutside(value: number): void {
    this.eventManager.notify('viewSetMin', value);
  }

  setMaxFromOutside(value: number): void {
    this.eventManager.notify('viewSetMax', value);
  }

  setStepFromOutside(value: number): void {
    this.eventManager.notify('viewSetStep', value);
  }

  toggleOrientationFromOutside(): void {
    this.vertical = !this.vertical;
    this.destroy();
    this.render();

    if (this.vertical) {
      this.thumbLeft.setIndent('left', 0);
      this.thumbRight?.setIndent('left', 0);
      this.range.setIndent('left', 0);
      this.range.setIndent('right', 0);
      this.range.resetTopIndent();
      this.range.resetWidth();
      this.valueLabelLeft?.setIndent('left', 'unset');
      this.valueLabelRight?.setIndent('left', 'unset');
      this.valueLabelCommon?.setIndent('left', 'unset');
      if (this.hasLabels()) this.fixLabelsContainerWidthForVertical();
      this.scale?.handleSwitchFromHorizontalToVertical();
    }

    if (!this.vertical) {
      this.component.classList.remove('range-slider_vertical');
      this.thumbLeft.setIndent('top', 0);
      this.thumbRight?.setIndent('top', 0);
      this.range.setIndent('bottom', 0);
      this.range.setIndent('top', 0);
      this.range.resetHeight();
      this.valueLabelLeft?.setIndent('top', 'unset');
      this.valueLabelRight?.setIndent('top', 'unset');
      this.valueLabelCommon?.setIndent('top', 'unset');
      if (this.hasLabels()) this.fixLabelsContainerHeightForHorizontal();
      this.scale?.handleSwitchFromVerticalToHorizontal();
    }

    this.eventManager.notify('viewToggleOrientation');
  }

  toggleRangeFromOutside(): void {
    const isRange = !this.isRange();
    this.destroy();

    if (isRange) {
      this.thumbRight = new Thumb(this, 'right');

      if (this.valueLabelLeft) {
        this.valueLabelRight = new Label('range-slider__value-label range-slider__value-label_right');
        this.valueLabelCommon = new Label('range-slider__value-label range-slider__value-label_common');
      }

      if (!this.vertical) {
        this.range.resetWidth();
      }

      if (this.vertical) {
        this.range.resetHeight();
      }
    }

    if (!isRange) {
      this.thumbRight = undefined;

      if (this.vertical) {
        this.range.resetTopIndent();
      }
    }

    this.render();
    this.eventManager.notify('viewToggleRange');
  }

  toggleScaleFromOutside(): void {
    this.eventManager.notify('viewToggleScale');
  }

  setScaleIntervals(value: number): void {
    if (value <= 0) return;

    this.scaleIntervals = Math.floor(value);
    this.removeScale();
    this.eventManager.notify('viewSetScaleIntervals');
  }

  toggleValueLabels(): void {
    if (this.valueLabelLeft) {
      this.valueLabelLeft.remove();
      this.valueLabelRight?.remove();
      this.valueLabelCommon?.remove();

      this.valueLabelLeft = undefined;
      this.valueLabelRight = undefined;
      this.valueLabelCommon = undefined;

      if (this.minLabel) {
        if (!this.vertical) {
          this.fixLabelsContainerHeightForHorizontal();
        }

        if (this.vertical) {
          this.fixLabelsContainerWidthForVertical();
        }
      }

      if (!this.minLabel) {
        this.labelsContainer?.remove();
        this.labelsContainer = undefined;
      }

      return;
    }

    if (!this.valueLabelLeft) {
      this.valueLabelLeft = new Label('range-slider__value-label range-slider__value-label_left');

      if (!this.labelsContainer) {
        this.labelsContainer = new LabelsContainer();
        this.slider.before(this.labelsContainer.getComponent());
      }

      this.labelsContainer.append(this.valueLabelLeft.getComponent());

      if (this.isRange()) {
        this.valueLabelRight = new Label('range-slider__value-label range-slider__value-label_right');
        this.valueLabelCommon = new Label('range-slider__value-label range-slider__value-label_common');

        this.labelsContainer
          .append(this.valueLabelRight?.getComponent(), this.valueLabelCommon?.getComponent());
      }

      this.eventManager.notify('viewAddValueLabels');

      if (!this.vertical) {
        this.fixLabelsContainerHeightForHorizontal();
      }

      if (this.vertical) {
        this.fixLabelsContainerWidthForVertical();
      }
    }
  }

  toggleMinMaxLabels(): void {
    if (this.minLabel) {
      this.minLabel.remove();
      this.maxLabel?.remove();

      this.minLabel = undefined;
      this.maxLabel = undefined;

      if (this.valueLabelLeft) {
        if (!this.vertical) {
          this.fixLabelsContainerHeightForHorizontal();
        }

        if (this.vertical) {
          this.fixLabelsContainerWidthForVertical();
        }
      }

      if (!this.valueLabelLeft) {
        this.labelsContainer?.remove();
        this.labelsContainer = undefined;
      }

      return;
    }

    if (!this.minLabel) {
      this.minLabel = new Label('range-slider__min-max-label range-slider__min-max-label_left');
      this.maxLabel = new Label('range-slider__min-max-label range-slider__min-max-label_right');

      if (!this.labelsContainer) {
        this.labelsContainer = new LabelsContainer();
        this.slider.before(this.labelsContainer.getComponent());
      }

      this.labelsContainer.append(this.minLabel.getComponent(), this.maxLabel.getComponent());

      this.eventManager.notify('viewAddMinMaxLabels');

      if (!this.vertical) {
        this.fixLabelsContainerHeightForHorizontal();
      }

      if (this.vertical) {
        this.fixLabelsContainerWidthForVertical();
      }
    }
  }

  hasLabels(): boolean {
    return Boolean(this.valueLabelLeft || this.minLabel);
  }

  hasScale(): boolean {
    return Boolean(this.scale);
  }

  hasMinMaxLabels(): boolean {
    return Boolean(this.maxLabel);
  }

  hasValueLabels(): boolean {
    return Boolean(this.valueLabelLeft);
  }

  hasPanel(): boolean {
    return Boolean(this.panel);
  }

  isRange(): boolean {
    return Boolean(this.thumbRight);
  }

  isVertical(): boolean {
    return Boolean(this.vertical);
  }

  getTrackWidth(): number {
    return this.track.getWidth();
  }

  getTrackHeight(): number {
    return this.track.getHeight();
  }

  private render(): void {
    const fragment = new DocumentFragment();

    this.track.append(this.range.getComponent());
    this.slider.append(this.track.getComponent(), this.thumbLeft.getComponent());
    fragment.append(this.slider, this.input.getComponent());

    if (this.isRange() && this.thumbRight) {
      this.slider.append(this.thumbRight.getComponent());
    } else {
      if (!this.vertical) {
        this.range.setIndent('left', 0);
      }

      if (this.vertical) {
        this.range.setIndent('bottom', 0);
      }
    }

    if (this.minLabel && this.maxLabel) {
      this.labelsContainer?.append(this.minLabel.getComponent(), this.maxLabel.getComponent());
    }

    if (this.valueLabelLeft) {
      this.labelsContainer?.append(this.valueLabelLeft.getComponent());

      if (this.isRange()) {
        if (this.valueLabelRight && this.valueLabelCommon) {
          this.labelsContainer?.append(
            this.valueLabelRight.getComponent(),
            this.valueLabelCommon.getComponent(),
          );
        }
      }
    }

    if (this.labelsContainer) {
      this.slider.before(this.labelsContainer.getComponent());
    }

    if (this.vertical) {
      this.component.classList.add('range-slider_vertical');
    }

    if (this.panel) {
      const panelWrapper = BaseElement.createComponent('div', 'range-slider__panel');
      panelWrapper.append(this.panel.getComponent());
      fragment.append(panelWrapper);
    }

    if (this.scale) {
      this.slider.after(this.scale.getComponent());
    }

    this.component.append(fragment);
  }

  private destroy(): void {
    if (this.labelsContainer) {
      [...this.labelsContainer.getComponent().children].forEach((element) => {
        element.remove();
      });
    }

    [...this.slider.children].forEach((element) => {
      element.remove();
    });

    [...this.component.children].forEach((element) => {
      element.remove();
    });
  }

  private mergeLabels(): void {
    this.valueLabelLeft?.setOpacity(0);
    this.valueLabelRight?.setOpacity(0);
    this.valueLabelCommon?.setOpacity(1);

    if (!this.vertical && this.thumbRight) {
      const distanceBetweenThumbs = (
        parseInt(this.thumbRight.getLeftIndent(), 10)
        - parseInt(this.thumbLeft.getLeftIndent(), 10)
      );

      if (this.valueLabelLeft) {
        this.valueLabelCommon?.setIndent('left', `${parseInt(this.valueLabelLeft.getLeftIndent(), 10) + distanceBetweenThumbs / 2}%`);
      }
    }

    if (this.vertical && this.thumbRight) {
      const distanceBetweenThumbs = (
        parseInt(this.thumbRight.getTopIndent(), 10) - parseInt(this.thumbLeft.getTopIndent(), 10)
      );

      if (this.valueLabelRight) {
        this.valueLabelCommon?.setIndent('top', `${parseInt(this.valueLabelRight.getTopIndent(), 10) - distanceBetweenThumbs / 2}%`);
      }
    }
  }

  private splitLabels(): void {
    this.valueLabelCommon?.setOpacity(0);
    this.valueLabelLeft?.setOpacity(1);
    this.valueLabelRight?.setOpacity(1);
  }

  private isTwoLabelsClose(label1: Label, label2: Label): boolean {
    if (this.vertical) {
      const bottomLabelEdge = label1.getBoundingClientRect().top;
      const topLabelEdge = label2.getBoundingClientRect().bottom;

      return ((bottomLabelEdge - topLabelEdge) < 3);
    }

    const leftLabelEdge = label1.getBoundingClientRect().right;
    const rightLabelEdge = label2.getBoundingClientRect().left;

    return ((rightLabelEdge - leftLabelEdge) < 3);
  }

  private isTwoValueLabelsClose(): boolean {
    if (this.valueLabelLeft && this.valueLabelRight) {
      return this.isTwoLabelsClose(this.valueLabelLeft, this.valueLabelRight);
    }

    return false;
  }

  private isLeftValueLabelCloseToMinLabel(): boolean {
    if (this.minLabel && this.valueLabelLeft) {
      return this.isTwoLabelsClose(this.minLabel, this.valueLabelLeft);
    }

    return false;
  }

  private isLeftValueLabelCloseToMaxLabel(): boolean {
    if (this.valueLabelLeft && this.maxLabel) {
      return this.isTwoLabelsClose(this.valueLabelLeft, this.maxLabel);
    }

    return false;
  }

  private isRightValueLabelCloseToMaxLabel(): boolean {
    if (this.valueLabelRight && this.maxLabel) {
      return this.isTwoLabelsClose(this.valueLabelRight, this.maxLabel);
    }

    return false;
  }

  private whichThumbIsNearer(x: number, y: number): 'left' | 'right' {
    const leftThumbCoords = this.thumbLeft.getBoundingClientRect();
    const rightThumbCoords = this.thumbRight?.getBoundingClientRect();
    const trackCoords = this.track.getBoundingClientRect();

    let distanceFromLeftThumbCenter: number = 0;
    let distanceFromRightThumbCenter: number = 0;

    if (!this.vertical && rightThumbCoords) {
      const leftThumbCenter = leftThumbCoords.left + leftThumbCoords.width / 2 - trackCoords.left;
      const rightThumbCenter = rightThumbCoords.left
        + rightThumbCoords.width / 2
        - trackCoords.left;

      distanceFromLeftThumbCenter = Math.abs(x - leftThumbCenter);
      distanceFromRightThumbCenter = Math.abs(x - rightThumbCenter);
    }

    if (this.vertical && rightThumbCoords) {
      const leftThumbCenter = leftThumbCoords.top + leftThumbCoords.height / 2 - trackCoords.top;
      const rightThumbCenter = rightThumbCoords.top + rightThumbCoords.height / 2 - trackCoords.top;

      distanceFromLeftThumbCenter = Math.abs(y - leftThumbCenter);
      distanceFromRightThumbCenter = Math.abs(y - rightThumbCenter);
    }

    if (distanceFromLeftThumbCenter <= distanceFromRightThumbCenter) {
      return 'left';
    }

    return 'right';
  }

  private addSmoothTransition(side: 'left' | 'right' = 'left'): void {
    if (side === 'left') {
      this.thumbLeft.getComponent().classList.add('range-slider__thumb_smooth-transition');
      this.range.getComponent().classList.add('range-slider__range_smooth-transition');
      this.valueLabelLeft?.getComponent().classList.add('range-slider__value-label_smooth-transition');
    }

    if (side === 'right') {
      this.thumbRight?.getComponent().classList.add('range-slider__thumb_smooth-transition');
      this.range.getComponent().classList.add('range-slider__range_smooth-transition');
      this.valueLabelRight?.getComponent().classList.add('range-slider__value-label_smooth-transition');
    }
  }

  private removeSmoothTransition(side: 'left' | 'right' = 'left'): void {
    if (side === 'left') {
      this.thumbLeft.getComponent().classList.remove('range-slider__thumb_smooth-transition');
      this.range.getComponent().classList.remove('range-slider__range_smooth-transition');
      this.valueLabelLeft?.getComponent().classList.remove('range-slider__value-label_smooth-transition');
    }

    if (side === 'right') {
      this.thumbRight?.getComponent().classList.remove('range-slider__thumb_smooth-transition');
      this.range.getComponent().classList.remove('range-slider__range_smooth-transition');
      this.valueLabelRight?.getComponent().classList.remove('range-slider__value-label_smooth-transition');
    }
  }

  private collectLabels(): HTMLElement[] {
    const labels: HTMLElement[] = [];

    if (this.minLabel && this.maxLabel) {
      labels.push(this.minLabel.getComponent());
      labels.push(this.maxLabel.getComponent());
    }

    if (this.valueLabelLeft) {
      labels.push(this.valueLabelLeft.getComponent());
    }

    if (this.valueLabelRight) {
      labels.push(this.valueLabelRight.getComponent());
    }

    return labels;
  }
}

export default View;
