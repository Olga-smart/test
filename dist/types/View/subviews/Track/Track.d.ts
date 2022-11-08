import BaseElement from '../../BaseElement/BaseElement';
declare type ViewForTrack = {
    handleScaleOrTrackClick(x: number, y: number): void;
};
declare class Track extends BaseElement<'div'> {
    private view;
    constructor(view: ViewForTrack);
    append(...elements: HTMLElement[]): void;
    private handleClick;
    private attachEventHandlers;
}
export default Track;
//# sourceMappingURL=Track.d.ts.map