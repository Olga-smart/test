import BaseElement from '../../BaseElement/BaseElement';
declare type ViewForScale = {
    getScaleIntervals(): number;
    handleScaleOrTrackClick(x: number, y: number): void;
};
declare class Scale extends BaseElement<'div'> {
    private view;
    private intervals;
    private values;
    private valueElements;
    constructor(min: number, max: number, view: ViewForScale);
    fitWidthForVertical(indent?: number): void;
    fitHeightForHorizontal(indent?: number): void;
    handleSwitchFromHorizontalToVertical(): void;
    handleSwitchFromVerticalToHorizontal(): void;
    private createIntervals;
    private addMarksInIntervals;
    private addValues;
    private handleClick;
    private attachEventHandlers;
}
export default Scale;
//# sourceMappingURL=Scale.d.ts.map