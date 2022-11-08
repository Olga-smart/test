import BaseElement from '../../BaseElement/BaseElement';
declare type ViewForThumb = {
    handleLeftInput(clientX: number, clientY: number, shiftX: number, shiftY: number): void;
    handleRightInput(clientX: number, clientY: number, shiftX: number, shiftY: number): void;
};
declare class Thumb extends BaseElement<'div'> {
    private type;
    private view;
    constructor(view: ViewForThumb, type?: 'left' | 'right');
    getLeftIndent(): string;
    getTopIndent(): string;
    setZIndex(value: number): void;
    private static handlePointerOver;
    private static handlePointerOut;
    private static handlePointerUp;
    private static handleDragStart;
    private handlePointerDown;
    private attachEventHandlers;
}
export default Thumb;
//# sourceMappingURL=Thumb.d.ts.map