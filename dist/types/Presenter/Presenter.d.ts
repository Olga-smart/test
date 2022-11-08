import Model from '../Model/Model';
import View from '../View/View';
import { IEventListener } from '../EventManager/EventManager';
declare class Presenter implements IEventListener {
    private model;
    private view;
    constructor(model: Model, view: View);
    inform(eventType: string, data?: number | null): void;
    private static removeCalcInaccuracy;
    private initViewValues;
    private handleViewInputLeft;
    private handleModelSetLeft;
    private handleViewInputRight;
    private handleModelSetRight;
    private passLeftValueToView;
    private passRightValueToView;
    private updateViewInput;
    private convertValueToPercent;
    private convertPxToValue;
    private fitToStep;
    private handleViewSetLeftFromOutside;
    private handleViewSetRightFromOutside;
    private handleViewSetMin;
    private handleModelSetMin;
    private handleViewSetMax;
    private handleModelSetMax;
    private handleViewSetStep;
    private handleViewToggleOrientation;
    private handleViewToggleRange;
    private handleModelToggleRange;
    private handleModelSetStep;
    private handleViewToggleScale;
    private handleViewSetScaleIntervals;
    private handleViewAddValueLabels;
    private handleViewAddMinMaxLabels;
}
export default Presenter;
//# sourceMappingURL=Presenter.d.ts.map