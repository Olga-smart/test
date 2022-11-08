import 'airbnb-browser-shims';
import './style.scss';
declare global {
    interface JQuery {
        rangeSlider: IRangeSlider;
    }
    interface IRangeSlider {
        (options?: object): JQuery<HTMLElement>;
    }
}
//# sourceMappingURL=Wrapper.d.ts.map