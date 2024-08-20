class Option<T> {
  and<U>(o: Option<U>): Option<U> {
    return this.isSome() ? o : Option.fromNone();
  }

  andThen<U>(f: (v: T) => Option<U>) {
    return this.isSome() ? f(this.data!) : Option.fromNone();
  }

  cloned(): Option<T> {
    return structuredClone(this);
  }

  expect(msg: string): T {
    if (this.isNone()) {
      throw msg;
    }
    return this.data!;
  }

  filter(f: (v: T) => boolean): Option<T> {
    return this.isSome() && f(this.data!) ? this : Option.fromNone();
  }

  flatten(this: Option<Option<T>>): Option<T> {
    return this.isSome() ? this.unwrap() : Option.fromNone();
  }

  getOrInsert(v: T): T {
    if (this.isNone()) {
      this.data = v;
    }
    return this.data!;
  }

  insert(v: T): T {
    this.data = v;
    return this.data!;
  }

  inspect(f: (v: T) => void): Option<T> {
    this.map((v) => f(v));
    return this;
  }

  isNone(): boolean {
    return this.data == null;
  }

  isSome(): boolean {
    return this.data != null;
  }

  isSomeAnd(f: (v: T) => boolean): boolean {
    return this != null && f(this.data!);
  }

  iter(): Iterator<T> {
    return this.isSome() ? new Iterator([this.data!]) : new Iterator([]);
  }

  map<U>(f: (v: T) => U): Option<U> {
    return this.isSome() ? Option.fromSome(f(this.data!)) : Option.fromNone();
  }

  mapOr<U>(default_: U, f: (v: T) => U): Option<U> {
    return this.isSome()
      ? Option.fromSome(f(this.data!))
      : Option.fromSome(default_);
  }

  mapOrElse<U>(default_: () => U, f: (v: T) => U): Option<U> {
    return this.isSome()
      ? Option.fromSome(f(this.data!))
      : Option.fromSome(default_());
  }

  okOr<E>(err: E): Result<T, E> {
    return this.isSome() ? Result.fromOk(this.data!) : Result.fromErr(err);
  }

  okOrElse<E>(err: () => E): Result<T, E> {
    return this.isSome() ? Result.fromOk(this.data!) : Result.fromErr(err());
  }

  or(o: Option<T>): Option<T> {
    if (this.isSome()) {
      return this;
    } else if (o.isSome()) {
      return o;
    } else {
      return Option.fromNone();
    }
  }

  orElse(f: () => Option<T>): Option<T> {
    if (this.isSome()) {
      return this;
    }
    let o = f();
    if (o.isSome()) {
      return o;
    } else {
      return Option.fromNone();
    }
  }

  replace(v: T): Option<T> {
    let old = this.data;
    this.data = v;
    return this.isSome() ? Option.fromSome(old!) : Option.fromNone();
  }

  take(): Option<T> {
    let old = this.data;
    this.data = null;
    return this.isSome() ? Option.fromSome(old!) : Option.fromNone();
  }

  takeIf(f: (v: T) => boolean): Option<T> {
    if (this.isSome() && f(this.data!)) {
      let old = this.data;
      this.data = null;
      return this.isSome() ? Option.fromSome(old!) : Option.fromNone();
    } else {
      return Option.fromNone();
    }
  }

  transpose<E>(this: Option<Result<T, E>>): Result<Option<T>, E> {
    if (this.isSome()) {
      let res = this.data!;
      return res.isOk()
        ? Result.fromOk(Option.fromSome(res.unwrap()))
        : Result.fromErr(res.unwrapErr());
    }
    return Result.fromOk(Option.fromNone());
  }

  unwrap(): T {
    if (this.isNone()) {
      throw "called `Option.unwrap()` on a `None` value";
    }
    return this.data!;
  }

  unwrapOr(v: T): T {
    return this.isSome() ? this.data! : v;
  }

  unwrapOrElse(f: () => T) {
    return this.isSome() ? this.data! : f();
  }

  unzip<U>(this: Option<[T, U]>): [Option<T>, Option<U>] {
    return this.isSome()
      ? [Option.fromSome(this.data![0]), Option.fromSome(this.data![1])]
      : [Option.fromNone(), Option.fromNone()];
  }

  xor(o: Option<T>): Option<T> {
    if (this.isSome() && o.isSome()) {
      return Option.fromNone();
    } else {
      return this.or(o);
    }
  }

  zip<U>(o: Option<U>): Option<[T, U]> {
    return this.isSome() && o.isSome()
      ? Option.fromSome([this.data!, o.data!])
      : Option.fromNone();
  }

  constructor(private data: T | null) {
    this.data = data;
  }

  static then<T>(b: boolean, f: () => T): Option<T> {
    return b ? Option.fromSome(f()) : Option.fromNone();
  }

  static thenSome<T>(b: boolean, v: T): Option<T> {
    return b ? Option.fromSome(v) : Option.fromNone();
  }

  static fromSome<T>(data: T): Option<T> {
    return new Option<T>(data);
  }

  static fromNone<T>(): Option<T> {
    return new Option<T>(null);
  }
}

//
// `std::option::Result`
//

class Result<T, E> {
  and<U>(o: Result<U, E>): Result<U, E> {
    return this.isOk() ? o : Result.fromErr(this.data! as E);
  }

  andThen<U>(f: (v: T) => Result<U, E>): Result<U, E> {
    return this.isOk() ? f(this.data! as T) : Result.fromErr(this.data! as E);
  }

  cloned(): Result<T, E> {
    return structuredClone(this);
  }

  err(): Option<E> {
    return this.isErr() ? Option.fromSome(this.data! as E) : Option.fromNone();
  }

  expect(msg: string): T {
    if (this.isErr()) {
      throw msg;
    }
    return this.data! as T;
  }

  expectErr(msg: string): E {
    if (this.isOk()) {
      throw msg;
    }
    return this.data! as E;
  }

  inspect(f: (v: T) => void): Result<T, E> {
    this.map((v) => f(v));
    return this;
  }

  inspectErr(f: (v: E) => void): Result<T, E> {
    this.mapErr((v) => f(v));
    return this;
  }

  isErr(): boolean {
    return !this.dataIsOk;
  }

  isErrAnd(f: (v: E) => boolean): boolean {
    return !this.dataIsOk && f(this.data! as E);
  }

  isOk(): boolean {
    return this.dataIsOk;
  }

  isOkAnd(f: (v: T) => boolean): boolean {
    return this.dataIsOk && f(this.data! as T);
  }

  iter(): Iterator<T> {
    return this.isOk() ? new Iterator([this.data! as T]) : new Iterator([]);
  }

  map<U>(f: (v: T) => U): Result<U, E> {
    return this.isOk()
      ? Result.fromOk(f(this.data! as T))
      : Result.fromErr(this.data! as E);
  }

  mapErr<U>(f: (v: E) => U): Result<T, U> {
    return this.isErr()
      ? Result.fromErr(f(this.data! as E))
      : Result.fromOk(this.data! as T);
  }

  mapOr<U>(default_: U, f: (v: T) => U): Result<U, E> {
    return this.isOk()
      ? Result.fromOk(f(this.data! as T))
      : Result.fromOk(default_);
  }
  mapOrElse<U>(default_: (e: E) => U, f: (v: T) => U): Result<U, E> {
    return this.isOk()
      ? Result.fromOk(f(this.data! as T))
      : Result.fromOk(default_(this.data! as E));
  }

  ok(): Option<T> {
    return this.isOk() ? Option.fromSome(this.data! as T) : Option.fromNone();
  }

  or(o: Result<T, E>): Result<T, E> {
    if (this.isOk()) {
      return this;
    } else if (o.isOk()) {
      return o;
    } else {
      return Result.fromErr(this.data! as E);
    }
  }

  orElse(f: (e: E) => Result<T, E>): Result<T, E> {
    if (this.isOk()) {
      return this;
    }
    let o = f(this.data! as E);
    if (o.isOk()) {
      return o;
    } else {
      return Result.fromErr(this.data! as E);
    }
  }

  transpose(this: Result<Option<T>, E>): Option<Result<T, E>> {
    if (this.isOk()) {
      let res = this.data! as Option<T>;
      return res.isSome()
        ? Option.fromSome(Result.fromOk(res.unwrap()))
        : Option.fromNone();
    } else {
      let res = this.data! as E;
      return Option.fromSome(Result.fromErr(res));
    }
  }

  unwrap(): T {
    if (this.isErr()) {
      throw "called `Result.unwrap()` on a `Err` value";
    }
    return this.data! as T;
  }

  unwrapErr(): E {
    if (this.isOk()) {
      throw "called `Result.unwrap()` on a `Ok()` value";
    }
    return this.data! as E;
  }

  unwrapOr(v: T): T {
    return this.isOk() ? (this.data! as T) : v;
  }

  unwrapOrElse(f: () => T): T {
    return this.isOk() ? (this.data! as T) : f();
  }

  constructor(
    private data: T | E,
    private dataIsOk: boolean,
  ) {
    this.data = data;
    this.dataIsOk = dataIsOk;
  }

  static fromOk<T, E>(data: T): Result<T, E> {
    return new Result<T, E>(data, true);
  }

  static fromErr<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(error, false);
  }
}

//
// `std::option::Iterator`
//

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

export { Iterator, Option, Result };
