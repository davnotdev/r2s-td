import { Result } from "./result";
import { Iterator } from "./iterator";

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

  flatten<U>(this: Option<Option<U>>): Option<U> {
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

  mapOr<U>(default_: U, f: (v: T) => U): U {
    return this.isSome() ? f(this.data!) : default_;
  }

  mapOrElse<U>(default_: () => U, f: (v: T) => U): U {
    return this.isSome() ? f(this.data!) : default_();
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
    return old ? Option.fromSome(old!) : Option.fromNone();
  }

  takeIf(f: (v: T) => boolean): Option<T> {
    if (this.isSome() && f(this.data!)) {
      let old = this.data;
      this.data = null;
      return old ? Option.fromSome(old!) : Option.fromNone();
    } else {
      return Option.fromNone();
    }
  }

  transpose<U, E>(this: Option<Result<U, E>>): Result<Option<U>, E> {
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

  unzip<U, V>(this: Option<[U, V]>): [Option<U>, Option<V>] {
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

export { Option };
