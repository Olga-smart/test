import Model from '../Model/Model';
import View from '../View/View';
import { IEventListener } from '../EventManager/EventManager';

class Presenter implements IEventListener {
  private model: Model;

  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.initViewValues();
    this.model.subscribe(this);
    this.view.subscribe(this);
  }

  inform(eventType: string, data: number | null = null): void {
    switch (eventType) {
      case 'viewInputLeft':
        if (typeof data === 'number') {
          this.handleViewInputLeft(data);
        }
        break;
      case 'viewInputRight':
        if (typeof data === 'number') {
          this.handleViewInputRight(data);
        }
        break;
      case 'viewSetLeftFromOutside':
        if (typeof data === 'number') {
          this.handleViewSetLeftFromOutside(data);
        }
        break;
      case 'viewSetRightFromOutside':
        if (typeof data === 'number') {
          this.handleViewSetRightFromOutside(data);
        }
        break;
      case 'viewSetMin':
        if (typeof data === 'number') {
          this.handleViewSetMin(data);
        }
        break;
      case 'viewSetMax':
        if (typeof data === 'number') {
          this.handleViewSetMax(data);
        }
        break;
      case 'viewSetStep':
        if (typeof data === 'number') {
          this.handleViewSetStep(data);
        }
        break;
      case 'viewToggleOrientation':
        this.handleViewToggleOrientation();
        break;
      case 'viewToggleRange':
        this.handleViewToggleRange();
        break;
      case 'viewToggleScale':
        this.handleViewToggleScale();
        break;
      case 'viewSetScaleIntervals':
        this.handleViewSetScaleIntervals();
        break;
      case 'viewAddValueLabels':
        this.handleViewAddValueLabels();
        break;
      case 'viewAddMinMaxLabels':
        this.handleViewAddMinMaxLabels();
        break;

      case 'modelSetLeft':
        this.handleModelSetLeft();
        break;
      case 'modelSetRight':
        this.handleModelSetRight();
        break;
      case 'modelSetMin':
        this.handleModelSetMin();
        break;
      case 'modelSetMax':
        this.handleModelSetMax();
        break;
      case 'modelToggleRange':
        this.handleModelToggleRange();
        break;
      case 'modelSetStep':
        this.handleModelSetStep();
        break;

      default:
        break;
    }
  }

  private static removeCalcInaccuracy(value: number): number {
    return Number(value.toFixed(10));
  }

  private initViewValues(): void {
    const { model } = this;
    const { view } = this;

    const min = model.getMin();
    const max = model.getMax();
    const leftValue = model.getLeftValue();
    const rightValue = model.getRightValue();

    view.setMinValue(min);
    view.setMaxValue(max);
    this.passLeftValueToView(leftValue);

    if (view.isRange() && (rightValue !== undefined)) {
      this.passRightValueToView(rightValue);
      view.updateInput(leftValue, rightValue);
    } else {
      view.updateInput(leftValue);
    }

    if (view.hasScale()) {
      // first remove scale with arbitrary values, which was added as a plug
      view.removeScale();
      view.addScale(min, max);
    }

    if (this.view.hasLabels()) {
      if (!view.isVertical()) {
        view.fixLabelsContainerHeightForHorizontal();
      }

      if (view.isVertical()) {
        view.fixLabelsContainerWidthForVertical();
      }
    }

    if (view.hasPanel()) {
      view.setPanelValues({
        min,
        max,
        step: model.getStep(),
        from: leftValue,
        to: rightValue ?? null,
        vertical: view.isVertical() ?? false,
        range: view.isRange(),
        scale: view.hasScale(),
        scaleIntervals: view.getScaleIntervals(),
        valueLabels: view.hasValueLabels(),
        minMaxLabels: view.hasMinMaxLabels(),
      });
    }
  }

  private handleViewInputLeft(px: number): void {
    const value = this.convertPxToValue(px);
    this.model.setLeftValue(value);
  }

  private handleModelSetLeft(): void {
    const value = this.model.getLeftValue();
    this.passLeftValueToView(value);
    this.updateViewInput();

    if (this.view.hasPanel()) {
      this.view.updatePanelFrom(value);
    }
  }

  private handleViewInputRight(px: number): void {
    const value = this.convertPxToValue(px);
    this.model.setRightValue(value);
  }

  private handleModelSetRight(): void {
    const value = this.model.getRightValue()!;
    this.passRightValueToView(value);
    this.updateViewInput();

    if (this.view.hasPanel()) {
      this.view.updatePanelTo(value);
    }
  }

  private passLeftValueToView(value: number): void {
    const percent = this.convertValueToPercent(value);
    this.view.setLeftValue(value, percent);
  }

  private passRightValueToView(value: number): void {
    const percent = this.convertValueToPercent(value);
    this.view.setRightValue(value, percent);
  }

  private updateViewInput(): void {
    if (!this.view.isRange()) {
      this.view.updateInput(this.model.getLeftValue());
    }

    if (this.view.isRange()) {
      this.view.updateInput(this.model.getLeftValue(), this.model.getRightValue());
    }
  }

  private convertValueToPercent(value: number): number {
    const min = this.model.getMin();
    const max = this.model.getMax();
    let percent = ((value - min) / (max - min)) * 100;
    percent = Presenter.removeCalcInaccuracy(percent);

    return percent;
  }

  private convertPxToValue(px: number): number {
    let percent = 0;

    if (!this.view.isVertical()) {
      const trackWidthInPx = this.view.getTrackWidth();
      percent = (px * 100) / trackWidthInPx;
    }

    if (this.view.isVertical()) {
      const trackHeightInPx = this.view.getTrackHeight();
      percent = (px * 100) / trackHeightInPx;
    }

    const min = this.model.getMin();
    const max = this.model.getMax();
    let value = ((max - min) * (percent / 100) + min);
    value = this.fitToStep(value);
    value = Presenter.removeCalcInaccuracy(value);

    return value;
  }

  private fitToStep(value: number): number {
    let result = Math.round(value / this.model.getStep()) * this.model.getStep();
    result = Presenter.removeCalcInaccuracy(result);
    return result;
  }

  private handleViewSetLeftFromOutside(value: number): void {
    this.model.setLeftValue(value);
  }

  private handleViewSetRightFromOutside(value: number): void {
    this.model.setRightValue(value);
  }

  private handleViewSetMin(value: number): void {
    this.model.setMin(value);
  }

  private handleModelSetMin(): void {
    this.view.setMinValue(this.model.getMin());
    this.passLeftValueToView(this.model.getLeftValue());

    const rightValue = this.model.getRightValue();
    if (rightValue !== undefined) {
      this.passRightValueToView(rightValue);
    }

    if (this.view.hasScale()) {
      this.view.removeScale();
      this.view.addScale(this.model.getMin(), this.model.getMax());
    }

    if (this.view.hasPanel()) {
      this.view.updatePanelMin(this.model.getMin());
    }
  }

  private handleViewSetMax(value: number): void {
    this.model.setMax(value);
  }

  private handleModelSetMax(): void {
    this.view.setMaxValue(this.model.getMax());
    this.passLeftValueToView(this.model.getLeftValue());

    const rightValue = this.model.getRightValue();
    if (rightValue !== undefined) {
      this.passRightValueToView(rightValue);
    }

    if (this.view.hasScale()) {
      this.view.removeScale();
      this.view.addScale(this.model.getMin(), this.model.getMax());
    }

    if (this.view.hasPanel()) {
      this.view.updatePanelMax(this.model.getMax());
    }
  }

  private handleViewSetStep(value: number): void {
    this.model.setStep(value);
  }

  private handleViewToggleOrientation(): void {
    this.passLeftValueToView(this.model.getLeftValue());

    if (this.view.isRange()) {
      const rightValue = this.model.getRightValue();
      if (rightValue !== undefined) {
        this.passRightValueToView(rightValue);
      }
    }
  }

  private handleViewToggleRange(): void {
    this.model.toggleRange();
  }

  private handleModelToggleRange(): void {
    this.passLeftValueToView(this.model.getLeftValue());

    if (this.model.isRange()) {
      this.model.setRightValue();
      const rightValue = this.model.getRightValue();
      if (rightValue !== undefined) {
        this.passRightValueToView(rightValue);
        this.view.updateInput(this.model.getLeftValue(), rightValue);
        if (this.view.hasPanel()) {
          this.view.updatePanelTo(rightValue);
        }
      }
    }

    if (!this.model.isRange()) {
      this.model.removeRightValue();
      this.view.updateInput(this.model.getLeftValue());
      if (this.view.hasPanel()) {
        this.view.updatePanelTo('');
      }
    }
  }

  private handleModelSetStep(): void {
    if (this.view.hasPanel()) {
      this.view.updatePanelStep(this.model.getStep());
    }
  }

  private handleViewToggleScale(): void {
    if (!this.view.hasScale()) {
      this.view.addScale(this.model.getMin(), this.model.getMax());

      if (this.view.hasPanel()) {
        this.view.updatePanelScaleIntervals(this.view.getScaleIntervals() ?? 4);
      }

      return;
    }

    if (this.view.hasScale()) {
      this.view.removeScale();

      if (this.view.hasPanel()) {
        this.view.updatePanelScaleIntervals('');
      }
    }
  }

  private handleViewSetScaleIntervals(): void {
    this.view.addScale(this.model.getMin(), this.model.getMax());
  }

  private handleViewAddValueLabels(): void {
    this.passLeftValueToView(this.model.getLeftValue());
    if (this.view.isRange()) {
      const rightValue = this.model.getRightValue();
      if (rightValue !== undefined) {
        this.passRightValueToView(rightValue);
      }
    }
  }

  private handleViewAddMinMaxLabels(): void {
    this.view.setMinValue(this.model.getMin());
    this.view.setMaxValue(this.model.getMax());
  }
}

export default Presenter;
