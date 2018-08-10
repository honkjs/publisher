/**
 * A function that will unsubscribe the listener
 */
export interface IUnsubscribe {
  (): void;
}

/**
 * Describes a basic publisher function type.
 * A function that takes any arguments, and returns nothing or a boolean.
 * If 'true' is returned, then event propagation is stopped.
 */
export type IPublish = (...args: any[]) => void | boolean;

/**
 * An event publisher.
 *
 * @export
 * @class Publisher
 * @template T
 */
export class Publisher<T extends IPublish> {
  publish: T;

  private currentListeners: T[] = [];
  private nextListeners: T[] = [];
  private publishing = false;

  constructor() {
    // much types, so safety
    this.publish = this.pub as any;
  }

  get isPublishing() {
    return this.publishing;
  }

  subscribe(listener: T): IUnsubscribe {
    if (this.nextListeners === this.currentListeners) {
      this.nextListeners = this.currentListeners.slice();
    }

    this.nextListeners.push(listener);

    const self = this;
    let isSubscribed = true;
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      isSubscribed = false;
      const i = self.nextListeners.indexOf(listener);
      self.nextListeners.splice(i, 1);
    };
  }

  private pub() {
    const args = arguments;
    this.publishing = true;
    const listeners = (this.currentListeners = this.nextListeners);
    try {
      for (let i = 0; i < listeners.length; i++) {
        const sub = listeners[i];
        if (sub.apply(sub, args) === true) {
          break; // handled
        }
      }
    } finally {
      this.publishing = false;
    }
  }
}
