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
      this.map(() => f(this.data!));
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
      return this.is_some() ? this : o;
    }

    or_else(o: () => Option<T>): Option<T> {
      return this.is_some() ? this : o();
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

    // Please never use this.
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

    // Please never use this.
    constructor(v: T | E) {
      this.data = v;
    }

    static from_ok<T, E>(data: T): Result<T, E> {
      return new Result<T, E>(data);
    }

    static from_err<T, E>(error: E): Result<T, E> {
      return new Result<T, E>(error);
    }
  }

  export class Iterator<I> {}
}

export { R2STD };
