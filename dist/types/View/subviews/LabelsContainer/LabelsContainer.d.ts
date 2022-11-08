import BaseElement from '../../BaseElement/BaseElement';
declare class LabelsContainer extends BaseElement<'div'> {
    constructor();
    append(...elements: HTMLElement[]): void;
    fixWidthForVertical(labels: HTMLElement[], indent?: number): void;
    fixHeightForHorizontal(labels: HTMLElement[], indent?: number): void;
}
export default LabelsContainer;
//# sourceMappingURL=LabelsContainer.d.ts.map