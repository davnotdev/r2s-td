import { Option } from "./option";
import { Iterator } from "./iterator";

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

  transpose<U>(this: Result<Option<U>, E>): Option<Result<U, E>> {
    if (this.isOk()) {
      let res = this.data! as Option<U>;
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

export { Result };
