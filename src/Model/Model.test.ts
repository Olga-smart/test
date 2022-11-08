import Model from './Model';

describe('Model', () => {
  const defaultOptions = {
    min: 10,
    max: 100,
    leftValue: 25,
    rightValue: 75,
    step: 5,
    range: true,
  };

  describe('constructor()', () => {
    const model = new Model({
      min: 10,
      max: 100,
      leftValue: 25,
      rightValue: 75,
      step: 5,
      range: true,
    });

    it('set up event manager', () => {
      expect(model).toHaveProperty('eventManager');
    });

    it('set up min value', () => {
      expect(model.getMin()).toBe(10);
    });

    it('set up max value', () => {
      expect(model.getMax()).toBe(100);
    });

    it('set up left value', () => {
      expect(model.getLeftValue()).toBe(25);
    });

    it('set up right value (if range: true)', () => {
      expect(model.getRightValue()).toBe(75);
    });

    it('set up step', () => {
      expect(model.getStep()).toBe(5);
    });

    it('set up isRange', () => {
      expect(model.isRange()).toBe(true);
    });
  });

  describe('setLeftValue(value)', () => {
    it('set up left value', () => {
      const model = new Model(defaultOptions);
      model.setLeftValue(10);

      expect(model.getLeftValue()).toBe(10);
    });

    it('set up left value = min, if user is trying to set left value < min', () => {
      const model = new Model(defaultOptions);
      model.setLeftValue(5);

      expect(model.getLeftValue()).toBe(10);
    });

    it('set up left value = max, if user is trying to set left value > max', () => {
      const model = new Model({ ...defaultOptions, range: false });
      model.setLeftValue(101);

      expect(model.getLeftValue()).toBe(100);
    });

    it('set up left value = right value, if user is trying to set left value > right value', () => {
      const model = new Model(defaultOptions);
      model.setLeftValue(80);

      expect(model.getLeftValue()).toBe(75);
    });

    it('say subscribers that left value was set', () => {
      const model = new Model(defaultOptions);
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setLeftValue(10);

      expect(subscriber.inform).toBeCalledWith('modelSetLeft', null);
    });
  });

  describe('setRightValue(value)', () => {
    it('set up right value', () => {
      const model = new Model(defaultOptions);
      model.setRightValue(100);

      expect(model.getRightValue()).toBe(100);
    });

    it('set up right value = max, if user is trying to set right value > max', () => {
      const model = new Model(defaultOptions);
      model.setRightValue(101);

      expect(model.getRightValue()).toBe(100);
    });

    it('set up right value = max, if value is not passed', () => {
      const model = new Model(defaultOptions);
      model.setMax(100);
      model.setRightValue();

      expect(model.getRightValue()).toBe(100);
    });

    it('set up right value = left value, if user is trying to set right value < left value', () => {
      const model = new Model(defaultOptions);
      model.setRightValue(20);

      expect(model.getRightValue()).toBe(25);
    });

    it('say subscribers that right value was set', () => {
      const model = new Model(defaultOptions);
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setRightValue(100);

      expect(subscriber.inform).toBeCalledWith('modelSetRight', null);
    });

    it('nothing happens, if slider is not range', () => {
      const model = new Model({ ...defaultOptions, range: false });
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setRightValue(100);

      expect(subscriber.inform).not.toBeCalled();
      expect(model.getRightValue()).toBeUndefined();
    });
  });

  describe('removeRightValue()', () => {
    it('set rightValue property to undefined', () => {
      const model = new Model(defaultOptions);
      expect(model.getRightValue()).toBe(75);

      model.removeRightValue();
      expect(model.getRightValue()).toBeUndefined();
    });
  });

  describe('setMin(value)', () => {
    it('set up min value', () => {
      const model = new Model(defaultOptions);
      model.setMin(10);

      expect(model.getMin()).toBe(10);
    });

    it('say subscribers that min was changed', () => {
      const model = new Model(defaultOptions);
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setMin(10);

      expect(subscriber.inform).toBeCalledWith('modelSetMin', null);
    });

    it('nothing happens if passed value > left value', () => {
      const model = new Model(defaultOptions);
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setMin(30);

      expect(model.getMin()).toBe(10);
      expect(subscriber.inform).not.toBeCalled();
    });
  });

  describe('setMax(value)', () => {
    describe('set up max value', () => {
      it('if slider is range', () => {
        const model = new Model(defaultOptions);
        model.setMax(200);

        expect(model.getMax()).toBe(200);
      });

      it('if slider is not range', () => {
        const model = new Model({ ...defaultOptions, range: false });
        model.setMax(200);

        expect(model.getMax()).toBe(200);
      });
    });

    it('say subscribers that max was changed', () => {
      const model = new Model(defaultOptions);
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setMax(200);

      expect(subscriber.inform).toBeCalledWith('modelSetMax', null);
    });

    it('nothing happens if passed value < left value', () => {
      const model = new Model({ ...defaultOptions, range: false });
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setMax(20);

      expect(model.getMax()).toBe(100);
      expect(subscriber.inform).not.toBeCalled();
    });

    it('nothing happens if passed value < right value', () => {
      const model = new Model(defaultOptions);
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setMax(70);

      expect(model.getMax()).toBe(100);
      expect(subscriber.inform).not.toBeCalled();
    });
  });

  describe('setStep(value)', () => {
    it('set up step value', () => {
      const model = new Model(defaultOptions);
      model.setStep(10);

      expect(model.getStep()).toBe(10);
    });

    it('say subscribers that step was changed', () => {
      const model = new Model(defaultOptions);
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.setStep(10);

      expect(subscriber.inform).toBeCalledWith('modelSetStep', null);
    });

    it('nothing happens, if value = 0', () => {
      const model = new Model(defaultOptions);
      model.setStep(10);
      model.setStep(0);

      expect(model.getStep()).toBe(10);
    });

    it('nothing happens, if value < 0', () => {
      const model = new Model(defaultOptions);
      model.setStep(10);
      model.setStep(-5);

      expect(model.getStep()).toBe(10);
    });

    it('nothing happens, if value > |max - min|', () => {
      const model = new Model(defaultOptions);
      model.setMin(10);
      model.setMax(100);
      model.setStep(10);
      model.setStep(100);

      expect(model.getStep()).toBe(10);
    });
  });

  describe('toggleRange()', () => {
    it('set up isRange property to false, if slider was range', () => {
      const model = new Model({ ...defaultOptions, range: true });
      model.toggleRange();

      expect(model.isRange()).toBe(false);
    });

    it('set up isRange property to true, if slider was not range', () => {
      const model = new Model({ ...defaultOptions, range: false });
      model.toggleRange();

      expect(model.isRange()).toBe(true);
    });

    it('say subscribers that range was changed', () => {
      const model = new Model({ ...defaultOptions, range: true });
      const subscriber = {
        inform() {},
      };
      subscriber.inform = jest.fn();
      model.subscribe(subscriber);
      model.toggleRange();

      expect(subscriber.inform).toBeCalledWith('modelToggleRange', null);
    });
  });
});
