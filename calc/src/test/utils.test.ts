import {extend} from '../util';

describe('util', () => {
  test('extend', () => {
    const obj1 = {a: 1, b: {c: 2}, d: {e: 3}, f: 4};
    const obj2 = {a: 2, b: {c: 3}, d: 4, e: {f: 5}};

    expect(extend(true, {}, obj1)).toEqual(obj1);
    expect(extend(true, {}, obj1, obj2)).toEqual({a: 2, b: {c: 3}, d: 4, e: {f: 5}, f: 4});
    expect(extend(true, {}, obj2, obj1)).toEqual({
      a: 1,
      b: {c: 2},
      d: {e: 3},
      e: {f: 5},
      f: 4,
    });
  });
});
