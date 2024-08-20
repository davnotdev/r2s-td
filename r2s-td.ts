namespace R2STD {
  export class Option<T> {
    private data: T | null;

    and<U>(o: Option<U>): Option<U> {
      return this.is_some() ? o : Option.from_none();
    }

    and_then<U>(f: (v: T) => Option<U>) {
      return this.is_some() ? f(this.data!) : Option.from_none();
    }

    cloned(): Option<T> {
      return structuredClone(this);
    }

    expect(msg: string): T {
      if (this.is_none()) {
        throw msg;
      }
      return this.data!;
    }

    filter(f: (v: T) => boolean): Option<T> {
      return this.is_some() && f(this.data!) ? this : Option.from_none();
    }

    inspect(f: (v: T) => void): Option<T> {
      this.map((v) => f(v));
      return this;
    }

    is_none() {
      return this == null;
    }

    is_some() {
      return this != null;
    }

    iter(): Iterator<T> {
      return this.is_some() ? new Iterator([this.data!]) : new Iterator([]);
    }

    map<U>(f: (v: T) => U): Option<U> {
      return this.is_some()
        ? Option.from_some(f(this.data!))
        : Option.from_none();
    }

    map_or<U>(default_: U, f: (v: T) => U): Option<U> {
      return this.is_some()
        ? Option.from_some(f(this.data!))
        : Option.from_some(default_);
    }

    map_or_else<U>(default_: () => U, f: (v: T) => U): Option<U> {
      return this.is_some()
        ? Option.from_some(f(this.data!))
        : Option.from_some(default_());
    }

    ok_or<E>(err: E): Result<T, E> {
      return this.is_some() ? Result.from_ok(this.data!) : Result.from_err(err);
    }

    ok_or_else<E>(err: () => E): Result<T, E> {
      return this.is_some()
        ? Result.from_ok(this.data!)
        : Result.from_err(err());
    }

    or(o: Option<T>): Option<T> {
      if (this.is_some()) {
        return this;
      } else if (o.is_some()) {
        return o;
      } else {
        return Option.from_none();
      }
    }

    or_else(f: () => Option<T>): Option<T> {
      if (this.is_some()) {
        return this;
      }
      let o = f();
      if (o.is_some()) {
        return o;
      } else {
        return Option.from_none();
      }
    }

    replace(v: T): Option<T> {
      let old = this.data;
      this.data = v;
      return this.is_some() ? Option.from_some(old!) : Option.from_none();
    }

    take() {
      let old = this.data;
      this.data = null;
      return this.is_some() ? Option.from_some(old!) : Option.from_none();
    }

    unwrap(): T {
      if (this.is_none()) {
        throw "called `Option.unwrap()` on a `None` value";
      }
      return this.data!;
    }

    unwrap_or(v: T): T {
      return this.is_some() ? this.data! : v;
    }

    unwrap_or_else(f: () => T) {
      return this.is_some() ? this.data! : f();
    }

    xor(o: Option<T>): Option<T> {
      if (this.is_some() && o.is_some()) {
        return Option.from_none();
      } else {
        return this.or(o);
      }
    }

    zip<U>(o: Option<U>): Option<[T, U]> {
      return this.is_some() && o.is_some()
        ? Option.from_some([this.data!, o.data!])
        : Option.from_none();
    }

    constructor(data: T | null) {
      this.data = data;
    }

    static from_some<T>(data: T): Option<T> {
      return new Option<T>(data);
    }

    static from_none<T>(): Option<T> {
      return new Option<T>(null);
    }
  }

  export class Result<T, E> {
    private data: T | E;
    private data_is_ok: boolean;

    and<U>(o: Result<U, E>): Result<U, E> {
      return this.is_ok() ? o : Result.from_err(this.data! as E);
    }

    and_then<U>(f: (v: T) => Result<U, E>): Result<U, E> {
      return this.is_ok()
        ? f(this.data! as T)
        : Result.from_err(this.data! as E);
    }

    cloned(): Result<T, E> {
      return structuredClone(this);
    }

    err(): Option<E> {
      return this.is_err()
        ? Option.from_some(this.data! as E)
        : Option.from_none();
    }

    expect(msg: string): T {
      if (this.is_err()) {
        throw msg;
      }
      return this.data! as T;
    }

    expect_err(msg: string): E {
      if (this.is_ok()) {
        throw msg;
      }
      return this.data! as E;
    }

    inspect(f: (v: T) => void): Result<T, E> {
      this.map((v) => f(v));
      return this;
    }

    inspect_err(f: (v: E) => void): Result<T, E> {
      this.map_err((v) => f(v));
      return this;
    }

    is_err(): boolean {
      return !this.data_is_ok;
    }

    is_ok(): boolean {
      return this.data_is_ok;
    }

    iter(): Iterator<T> {
      return this.is_ok() ? new Iterator([this.data! as T]) : new Iterator([]);
    }

    map<U>(f: (v: T) => U): Result<U, E> {
      return this.is_ok()
        ? Result.from_ok(f(this.data! as T))
        : Result.from_err(this.data! as E);
    }

    map_err<U>(f: (v: E) => U): Result<T, U> {
      return this.is_err()
        ? Result.from_err(f(this.data! as E))
        : Result.from_ok(this.data! as T);
    }

    map_or<U>(default_: U, f: (v: T) => U): Result<U, E> {
      return this.is_ok()
        ? Result.from_ok(f(this.data! as T))
        : Result.from_ok(default_);
    }
    map_or_else<U>(default_: (e: E) => U, f: (v: T) => U): Result<U, E> {
      return this.is_ok()
        ? Result.from_ok(f(this.data! as T))
        : Result.from_ok(default_(this.data! as E));
    }

    ok(): Option<T> {
      return this.is_ok()
        ? Option.from_some(this.data! as T)
        : Option.from_none();
    }

    or(o: Result<T, E>): Result<T, E> {
      if (this.is_ok()) {
        return this;
      } else if (o.is_ok()) {
        return o;
      } else {
        return Result.from_err(this.data! as E);
      }
    }

    or_else(f: (e: E) => Result<T, E>): Result<T, E> {
      if (this.is_ok()) {
        return this;
      }
      let o = f(this.data! as E);
      if (o.is_ok()) {
        return o;
      } else {
        return Result.from_err(this.data! as E);
      }
    }

    unwrap(): T {
      if (this.is_err()) {
        throw "called `Result.unwrap()` on a `Err` value";
      }
      return this.data! as T;
    }

    unwrap_err(): E {
      if (this.is_ok()) {
        throw "called `Result.unwrap()` on a `Ok()` value";
      }
      return this.data! as E;
    }

    unwrap_or(v: T): T {
      return this.is_ok() ? (this.data! as T) : v;
    }

    unwrap_or_else(f: () => T): T {
      return this.is_ok() ? (this.data! as T) : f();
    }

    constructor(v: T | E, data_is_ok: boolean) {
      this.data = v;
      this.data_is_ok = data_is_ok;
    }

    static from_ok<T, E>(data: T): Result<T, E> {
      return new Result<T, E>(data, true);
    }

    static from_err<T, E>(error: E): Result<T, E> {
      return new Result<T, E>(error, false);
    }
  }

  export class Iterator<I> {
    private inner: Array<I>;

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
      return this.find(f).is_some();
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
      let new_inner: Array<[number, I]> = [];

      for (let i = 0; i < this.inner.length; i++) {
        new_inner = [...new_inner, [i, this.inner[i]]];
      }

      return new Iterator(new_inner);
    }

    filter(f: (i: I) => boolean): Iterator<I> {
      let new_inner: Array<I> = [];

      this.for_each((i) => {
        if (f(i)) {
          new_inner = [...new_inner, i];
        }
      });

      return new Iterator(new_inner);
    }

    filter_map<B>(f: (i: I) => Option<B>): Iterator<B> {
      let new_inner: Array<B> = [];

      this.for_each((i) => {
        let res = f(i);
        if (res.is_some()) {
          new_inner = [...new_inner, res.unwrap()];
        }
      });

      return new Iterator(new_inner);
    }

    find(f: (i: I) => boolean): Option<I> {
      for (let i = 0; i < this.inner.length; i++) {
        if (f(this.inner[i])) {
          return Option.from_some(this.inner[i]);
        }
      }
      return Option.from_none();
    }

    find_map(f: (i: I) => Option<I>): Option<I> {
      for (let i = 0; i < this.inner.length; i++) {
        let item = f(this.inner[i]);
        if (item.is_some()) {
          return item;
        }
      }
      return Option.from_none();
    }

    flat_map(f: (i: I) => Iterator<I>): Iterator<I> {
      let new_inner: Array<I> = [];
      this.for_each((i) => {
        let iter = f(i);
        iter.for_each((j) => {
          new_inner = [...new_inner, j];
        });
      });
      return new Iterator(new_inner);
    }

    fold<B>(init: B, f: (accum: B, i: I) => B): B {
      let accum = init;
      this.for_each((i) => {
        accum = f(accum, i);
      });
      return accum;
    }

    for_each(f: (i: I) => void) {
      for (let i = 0; i < this.inner.length; i++) {
        f(this.inner[i]);
      }
    }

    inspect(f: (i: I) => void): Iterator<I> {
      this.for_each(f);
      return this;
    }

    last(): I {
      return this.inner[this.inner.length - 1];
    }

    map<B>(f: (i: I) => B): Iterator<B> {
      let new_inner: Array<B> = [];
      this.for_each((i) => {
        let item = f(i);
        new_inner = [...new_inner, item];
      });
      return new Iterator(new_inner);
    }

    map_while<B>(f: (i: I) => Option<B>): Iterator<B> {
      let new_inner: Array<B> = [];
      for (let i = 0; i < this.inner.length; i++) {
        let item = f(this.inner[i]);
        if (item.is_none()) {
          break;
        }
        new_inner.push(item.unwrap());
      }
      return new Iterator(new_inner);
    }

    nth(nth: number): I {
      return this.inner[nth];
    }

    partition(f: (i: I) => [I, I]): [Array<I>, Array<I>] {
      let a: Array<I> = [];
      let b: Array<I> = [];
      this.for_each((i) => {
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
        ? Option.from_some(this.inner[0])
        : Option.from_none();
    }

    next_if(f: (i: I) => boolean): Option<I> {
      let next = this.peak();
      if (next.is_some() && f(next.unwrap())) {
        return Option.from_some(next.unwrap());
      }
      return Option.from_none();
    }

    position(f: (i: I) => boolean): Option<number> {
      return this.enumerate()
        .find(([_, i]) => f(i))
        .map(([idx, _]) => idx);
    }

    reduce(f: (accum: I, i: I) => I): Option<I> {
      if (this.inner.length == 0) {
        return Option.from_none();
      }
      return Option.from_some(this.fold(this.inner[0], f));
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
      return this.map_while((i) => {
        return f(state, i);
      });
    }

    skip(n: number): Iterator<I> {
      return new Iterator([...this.inner.slice(n)]);
    }

    skip_while(f: (i: I) => boolean): Iterator<I> {
      return this.map_while((i) => {
        return f(i) ? Option.from_some(i) : Option.from_none();
      });
    }

    step_by(step: number): Iterator<I> {
      let new_inner: Array<I> = [];
      for (let i = 0; i < this.inner.length; i += step) {
        new_inner = [...new_inner, this.inner[i]];
      }
      return new Iterator(new_inner);
    }

    take(n: number): Iterator<I> {
      return this.map_while((i) => {
        if (n == 0) {
          return Option.from_none();
        } else {
          n--;
          return Option.from_some(i);
        }
      });
    }

    take_while(f: (i: I) => boolean): Iterator<I> {
      return this.map_while((i) => {
        return f(i) ? Option.from_some(i) : Option.from_none();
      });
    }

    try_fold<B, E>(init: B, f: (accum: B, i: I) => Result<B, E>): Result<B, E> {
      let accum = init;
      let res = this.try_for_each((i) => f(accum, i));
      return res.is_ok()
        ? Result.from_ok(accum)
        : Result.from_err(res.unwrap_err());
    }

    try_for_each<B, E>(f: (i: I) => Result<B, E>): Result<void, E> {
      for (let i = 0; i < this.inner.length; i++) {
        let res = f(this.inner[i]);
        if (res.is_err()) {
          return Result.from_err(res.unwrap_err());
        }
      }
      return Result.from_ok(undefined);
    }

    zip<U>(o: Iterator<U>): Iterator<[I, U]> {
      let new_inner: Array<[I, U]> = [];
      for (let i = 0; i < Math.max(this.inner.length, o.inner.length); i++) {
        new_inner = [...new_inner, [this.inner[i], o.inner[i]]];
      }
      return new Iterator(new_inner);
    }

    constructor(inner: Array<I>) {
      this.inner = inner;
    }

    static from_array<I>(array: Array<I>): Iterator<I> {
      return new Iterator<I>(array);
    }
  }
}

export { R2STD };
