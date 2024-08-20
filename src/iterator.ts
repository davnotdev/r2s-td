import { Option } from "./option";
import { Result } from "./result";

class Iterator<I> implements Iterable<I> {
  next(): Option<I> {
    return new Option(this.inner[0]);
  }

  all(f: (i: I) => boolean): boolean {
    for (let i = 0; i < this.inner.length; i++) {
      if (!f(this.inner[i])) {
        return false;
      }
    }
    return true;
  }

  any(f: (i: I) => boolean): boolean {
    return this.find(f).isSome();
  }

  chain(o: Iterator<I>): Iterator<I> {
    return new Iterator([...this.inner.slice(), ...o.inner.slice()]);
  }

  cloned(): Iterator<I> {
    return structuredClone(this);
  }

  collect(): Array<I> {
    return this.inner.slice();
  }

  count(): number {
    return this.inner.length;
  }

  cycle(): Iterator<I> {
    let inner = this.inner.slice();

    if (inner.length == 0) {
      return new Iterator([]);
    }

    return new Iterator([...inner.slice(1), inner[0]]);
  }

  enumerate(): Iterator<[number, I]> {
    let newInner: Array<[number, I]> = [];

    for (let i = 0; i < this.inner.length; i++) {
      newInner = [...newInner, [i, this.inner[i]]];
    }

    return new Iterator(newInner);
  }

  filter(f: (i: I) => boolean): Iterator<I> {
    let newInner: Array<I> = [];

    this.forEach((i) => {
      if (f(i)) {
        newInner = [...newInner, i];
      }
    });

    return new Iterator(newInner);
  }

  filterMap<B>(f: (i: I) => Option<B>): Iterator<B> {
    let newInner: Array<B> = [];

    this.forEach((i) => {
      let res = f(i);
      if (res.isSome()) {
        newInner = [...newInner, res.unwrap()];
      }
    });

    return new Iterator(newInner);
  }

  find(f: (i: I) => boolean): Option<I> {
    for (let i = 0; i < this.inner.length; i++) {
      if (f(this.inner[i])) {
        return Option.fromSome(this.inner[i]);
      }
    }
    return Option.fromNone();
  }

  findMap(f: (i: I) => Option<I>): Option<I> {
    for (let i = 0; i < this.inner.length; i++) {
      let item = f(this.inner[i]);
      if (item.isSome()) {
        return item;
      }
    }
    return Option.fromNone();
  }

  flatMap(f: (i: I) => Iterator<I>): Iterator<I> {
    let newInner: Array<I> = [];
    this.forEach((i) => {
      let iter = f(i);
      iter.forEach((j) => {
        newInner = [...newInner, j];
      });
    });
    return new Iterator(newInner);
  }

  flatten(this: Iterator<Iterator<I>>): Iterator<I> {
    let newInner: Array<I> = [];
    this.forEach((i) => {
      i.forEach((j) => {
        newInner = [...newInner, j];
      });
    });
    return new Iterator(newInner);
  }

  fold<B>(init: B, f: (accum: B, i: I) => B): B {
    let accum = init;
    this.forEach((i) => {
      accum = f(accum, i);
    });
    return accum;
  }

  forEach(f: (i: I) => void) {
    for (let i = 0; i < this.inner.length; i++) {
      f(this.inner[i]);
    }
  }

  inspect(f: (i: I) => void): Iterator<I> {
    this.forEach(f);
    return this;
  }

  last(): I {
    return this.inner[this.inner.length - 1];
  }

  map<B>(f: (i: I) => B): Iterator<B> {
    let newInner: Array<B> = [];
    this.forEach((i) => {
      let item = f(i);
      newInner = [...newInner, item];
    });
    return new Iterator(newInner);
  }

  mapWhile<B>(f: (i: I) => Option<B>): Iterator<B> {
    let newInner: Array<B> = [];
    for (let i = 0; i < this.inner.length; i++) {
      let item = f(this.inner[i]);
      if (item.isNone()) {
        break;
      }
      newInner.push(item.unwrap());
    }
    return new Iterator(newInner);
  }

  nth(nth: number): I {
    return this.inner[nth];
  }

  partition(f: (i: I) => [I, I]): [Array<I>, Array<I>] {
    let a: Array<I> = [];
    let b: Array<I> = [];
    this.forEach((i) => {
      if (f(i)) {
        a = [...a, i];
      } else {
        b = [...b, i];
      }
    });
    return [a, b];
  }

  peekable(): Iterator<I> {
    return this;
  }

  peak(): Option<I> {
    return this.inner.length != 0
      ? Option.fromSome(this.inner[0])
      : Option.fromNone();
  }

  nextIf(f: (i: I) => boolean): Option<I> {
    let next = this.peak();
    if (next.isSome() && f(next.unwrap())) {
      return Option.fromSome(next.unwrap());
    }
    return Option.fromNone();
  }

  position(f: (i: I) => boolean): Option<number> {
    return this.enumerate()
      .find(([_, i]) => f(i))
      .map(([idx, _]) => idx);
  }

  reduce(f: (accum: I, i: I) => I): Option<I> {
    if (this.inner.length == 0) {
      return Option.fromNone();
    }
    return Option.fromSome(this.fold(this.inner[0], f));
  }

  rev(): Iterator<I> {
    let inner = this.inner.slice();
    return new Iterator(inner.reverse());
  }

  rposition(f: (i: I) => boolean): Option<number> {
    return this.rev().position(f);
  }

  scan<S, B>(init: S, f: (state: S, i: I) => Option<B>): Iterator<B> {
    let state = init;
    return this.mapWhile((i) => {
      return f(state, i);
    });
  }

  skip(n: number): Iterator<I> {
    return new Iterator([...this.inner.slice(n)]);
  }

  skipWhile(f: (i: I) => boolean): Iterator<I> {
    return this.mapWhile((i) => {
      return f(i) ? Option.fromSome(i) : Option.fromNone();
    });
  }

  stepBy(step: number): Iterator<I> {
    let newInner: Array<I> = [];
    for (let i = 0; i < this.inner.length; i += step) {
      newInner = [...newInner, this.inner[i]];
    }
    return new Iterator(newInner);
  }

  take(n: number): Iterator<I> {
    return this.mapWhile((i) => {
      if (n == 0) {
        return Option.fromNone();
      } else {
        n--;
        return Option.fromSome(i);
      }
    });
  }

  takeWhile(f: (i: I) => boolean): Iterator<I> {
    return this.mapWhile((i) => {
      return f(i) ? Option.fromSome(i) : Option.fromNone();
    });
  }

  tryFold<B, E>(init: B, f: (accum: B, i: I) => Result<B, E>): Result<B, E> {
    let accum = init;
    let res = this.tryForEach((i) => f(accum, i));
    return res.isOk() ? Result.fromOk(accum) : Result.fromErr(res.unwrapErr());
  }

  tryForEach<B, E>(f: (i: I) => Result<B, E>): Result<void, E> {
    for (let i = 0; i < this.inner.length; i++) {
      let res = f(this.inner[i]);
      if (res.isErr()) {
        return Result.fromErr(res.unwrapErr());
      }
    }
    return Result.fromOk(undefined);
  }

  unzip<A, B>(this: Iterator<[A, B]>): [Iterator<A>, Iterator<B>] {
    let a: Array<A> = [];
    let b: Array<B> = [];
    this.forEach(([ia, ib]) => {
      a = [...a, ia];
      b = [...b, ib];
    });

    return [new Iterator(a), new Iterator(b)];
  }

  zip<U>(o: Iterator<U>): Iterator<[I, U]> {
    let newInner: Array<[I, U]> = [];
    for (let i = 0; i < Math.min(this.inner.length, o.inner.length); i++) {
      newInner = [...newInner, [this.inner[i], o.inner[i]]];
    }
    return new Iterator(newInner);
  }

  constructor(private inner: Array<I>) {
    this.inner = inner;
  }

  static fromArray<I>(array: Array<I>): Iterator<I> {
    return new Iterator<I>(array);
  }

  *[Symbol.iterator]() {
    for (let i of this.inner) {
      yield i;
    }
  }
}

export { Iterator };
