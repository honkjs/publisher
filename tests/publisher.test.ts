import 'jest';
import { Publisher } from '../src';

test('sub, unsub, basic publisher', () => {
  const pub = new Publisher<(a: string, b: number) => void>();

  const sub1 = jest.fn((a, b) => {
    expect(a).toBe('test');
    expect(b).toBe(10);
    expect(pub.isPublishing).toBe(true);
  });

  const sub2 = jest.fn((a, b) => {
    expect(a).toBe('test');
    expect(b).toBe(10);
    expect(pub.isPublishing).toBe(true);
  });

  const unsub1 = pub.subscribe(sub1);
  const unsub2 = pub.subscribe(sub2);

  // note typechecking on publish
  pub.publish('test', 10);

  expect(pub.isPublishing).toBe(false);
  expect(sub1).toHaveBeenCalledTimes(1);
  expect(sub2).toHaveBeenCalledTimes(1);

  unsub1();

  pub.publish('test', 10);

  expect(sub1).toHaveBeenCalledTimes(1);
  expect(sub2).toHaveBeenCalledTimes(2);
});

test('breaks bubbling', () => {
  const pub = new Publisher();

  const sub1 = jest.fn((val) => {
    expect(val).toBe('test');
    return true;
  });

  const sub2 = jest.fn();

  const unsub = pub.subscribe(sub1);
  const unsub2 = pub.subscribe(sub2);

  pub.publish('test');

  expect(sub1).toHaveBeenCalledTimes(1);
  expect(sub2).not.toBeCalled();
});

test('can remove sub during event', () => {
  const pub = new Publisher();

  const sub1 = jest.fn();
  const unsub1 = pub.subscribe(sub1);

  const sub2 = jest.fn(() => {
    unsub1();
  });
  const unsub2 = pub.subscribe(sub2);

  pub.publish();

  expect(sub1).toHaveBeenCalledTimes(1);
  expect(sub2).toHaveBeenCalledTimes(1);

  pub.publish();

  // sub1 was unsubscribed
  expect(sub1).toHaveBeenCalledTimes(1);
  expect(sub2).toHaveBeenCalledTimes(2);
});

test('can add sub during event', () => {
  const pub = new Publisher();

  const sub1 = jest.fn();
  const sub2 = jest.fn(() => {
    const unsub1 = pub.subscribe(sub1);
  });
  const unsub2 = pub.subscribe(sub2);

  pub.publish();

  expect(sub1).toHaveBeenCalledTimes(0);
  expect(sub2).toHaveBeenCalledTimes(1);

  pub.publish();

  // sub1 was added
  expect(sub1).toHaveBeenCalledTimes(1);
  expect(sub2).toHaveBeenCalledTimes(2);
});

test('can unsub multiple times', () => {
  const pub = new Publisher();

  const sub1 = jest.fn();
  const unsub1 = pub.subscribe(sub1);

  pub.publish();

  expect(sub1).toHaveBeenCalledTimes(1);

  unsub1();
  unsub1();

  pub.publish();

  expect(sub1).toHaveBeenCalledTimes(1);
});
