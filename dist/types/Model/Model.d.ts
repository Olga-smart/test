import { IEventListener } from '../EventManager/EventManager';
declare type ModelOptions = {
    min: number;
    max: number;
    leftValue: number;
    rightValue?: number;
    step: number;
    range?: boolean;
};
declare class Model {
    private eventManager;
    private min;
    private max;
    private leftValue;
    private rightValue?;
    private step;
    private range;
    constructor(options: ModelOptions);
    subscribe(listener: IEventListener): void;
    setLeftValue(value: number): void;
    setRightValue(value?: number): void;
    removeRightValue(): void;
    setMin(value: number): void;
    setMax(value: number): void;
    setStep(value: number): void;
    toggleRange(): void;
    getMin(): number;
    getMax(): number;
    getLeftValue(): number;
    getRightValue(): number | undefined;
    getStep(): number;
    isRange(): boolean;
}
export default Model;
//# sourceMappingURL=Model.d.ts.map