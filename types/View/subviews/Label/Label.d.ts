import BaseElement from '../../BaseElement/BaseElement';
declare class Label extends BaseElement<'div'> {
    constructor(className?: string);
    setOpacity(value: number): void;
    setValue(value: number | string): void;
    getValue(): number;
    getLeftIndent(): string;
    getTopIndent(): string;
}
export default Label;
//# sourceMappingURL=Label.d.ts.map