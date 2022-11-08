declare type SliderOptions = {
    min: number;
    max: number;
    leftValue: number;
    rightValue: number;
    range: boolean;
    step: number;
    minMaxLabels: boolean;
    valueLabels: boolean;
    vertical: boolean;
    scale: boolean;
    scaleIntervals: number;
    panel: boolean;
};
declare class Slider {
    private model;
    private view;
    private presenter;
    constructor(element: HTMLDivElement, options: SliderOptions);
    inform(eventType: string): void;
    setLeftValue(value: number): this;
    setRightValue(value: number): this;
    setStep(value: number): this;
    onChange?: (leftValue: number, rightValue: number | undefined) => void;
}
export { Slider, SliderOptions };
//# sourceMappingURL=Slider.d.ts.map