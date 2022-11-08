import { EventManager } from './EventManager';

describe('EventManager', () => {
  describe('subscribe(listener)', () => {
    it('add listener to listeners list', () => {
      const eventManager = new EventManager();
      const listener = {
        inform() {},
      };
      listener.inform = jest.fn();
      eventManager.subscribe(listener);
      eventManager.notify('someEvent');

      expect(listener.inform).toBeCalled();
    });
  });

  describe('unsubscribe(listener)', () => {
    it('remove listener from listeners list', () => {
      const eventManager = new EventManager();
      const listener = {
        inform() {},
      };
      listener.inform = jest.fn();
      eventManager.subscribe(listener);
      eventManager.unsubscribe(listener);
      eventManager.notify('someEvent');

      expect(listener.inform).not.toBeCalled();
    });
  });

  describe('notify(eventType, data)', () => {
    const eventManager = new EventManager();
    const listener1 = {
      inform() {},
    };
    const listener2 = {
      inform() {},
    };
    const listener3 = {
      inform() {},
    };

    eventManager.subscribe(listener1);
    eventManager.subscribe(listener2);
    eventManager.subscribe(listener3);

    listener1.inform = jest.fn();
    listener2.inform = jest.fn();
    listener3.inform = jest.fn();

    it('call inform methods of all listeners', () => {
      eventManager.notify('someEvent', 5);

      [listener1, listener2, listener3].forEach((listener) => {
        expect(listener.inform).toBeCalledWith('someEvent', 5);
      });
    });

    it('if data is not passed, it is null by default', () => {
      eventManager.notify('someEvent');

      [listener1, listener2, listener3].forEach((listener) => {
        expect(listener.inform).toBeCalledWith('someEvent', null);
      });
    });

    it('if listeners list is empty, nothing happens', () => {
      const newEventManager = new EventManager();
      newEventManager.notify('someEvent', 5);
    });
  });
});
