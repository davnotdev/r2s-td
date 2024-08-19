namespace R2STD {
  export class Option<T> {
    data: T | null;

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

    iter() {}

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

    constructor() {
      this.data = null;
    }
    static from_some<T>(data: T): Option<T> {
      let self = new Option<T>();
      self.data = data;
      return self;
    }

    static from_none<T>(): Option<T> {
      let self = new Option<T>();
      self.data = null;
      return self;
    }
  }

  export class Result<T, E> {
    data: T | E;
    data_is_ok: boolean;

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

    iter() {}

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

    unwrap() {
      if (this.is_err()) {
        throw "called `Result.unwrap()` on a `Err` value";
      }
      return this.data!;
    }

    unwrap_err() {
      if (this.is_ok()) {
        throw "called `Result.unwrap()` on a `Ok()` value";
      }
      return this.data!;
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

  export class Iterator<I> {}
}

export { R2STD };
