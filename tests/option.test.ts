import { expect, test } from "bun:test";
import { Result, Option } from "../src/rst3s-td";

test("Option.and", () => {
  let x = Option.fromSome(2);
  let y: Option<string> = Option.fromNone();
  expect(x.and(y).isNone()).toBe(true);

  x = Option.fromNone();
  y = Option.fromSome("foo");
  expect(x.and(y).isNone()).toBe(true);

  x = Option.fromSome(2);
  y = Option.fromSome("foo");
  expect(x.and(y).unwrap()).toBe("foo");

  x = Option.fromNone();
  y = Option.fromNone();
  expect(x.and(y).isNone()).toBe(true);
});

test("Option.and_then", () => {
  function check(x: number): Option<string> {
    return Option.thenSome(x < 900, (x * x).toString());
  }

  expect(Option.fromSome(2).andThen(check)).toEqual(
    Option.fromSome((4).toString()),
  );
  expect(Option.fromSome(1_000_000).andThen(check)).toEqual(Option.fromNone()); // overflowed!
  expect(Option.fromNone<number>().andThen(check)).toEqual(Option.fromNone());

  const arr2d = [
    ["A0", "A1"],
    ["B0", "B1"],
  ];

  const item01 = Option.thenSome(arr2d[0] !== undefined, arr2d[0]).andThen(
    (row) => Option.thenSome(row[1] !== undefined, row[1]),
  );
  expect(item01).toEqual(Option.fromSome("A1"));

  const item20 = Option.thenSome(arr2d[2] !== undefined, arr2d[2]).andThen(
    (row) => Option.thenSome(row[0] !== undefined, row[0]),
  );
  expect(item20).toEqual(Option.fromNone());
});

test("Option.expect", () => {
  {
    let x = Option.fromSome("value");
    expect(x.expect("fruits are healthy")).toBe("value");
  }

  {
    let x: Option<string> = Option.fromNone();
    try {
      x.expect("fruits are healthy");
      // If we reach this point, the test should fail because it was supposed to throw
      expect(false).toBe(true);
    } catch (e) {
      expect(e).toBe("fruits are healthy");
    }
  }
});

test("Option.filter", () => {
  function isEven(n: number): boolean {
    return n % 2 === 0;
  }

  // Test case 1: None.filter(is_even) should be None
  let none: Option<number> = Option.fromNone();
  expect(none.filter(isEven).isNone()).toBe(true);

  // Test case 2: Some(3).filter(is_even) should be None
  let some3 = Option.fromSome(3);
  expect(some3.filter(isEven).isNone()).toBe(true);

  // Test case 3: Some(4).filter(is_even) should be Some(4)
  let some4 = Option.fromSome(4);
  let filteredOption = some4.filter(isEven);
  expect(filteredOption.isSome()).toBe(true);
  expect(filteredOption.unwrap()).toBe(4);
});

test("Option.flatten", () => {
  {
    // Test case 1: Some(Some(6)).flatten() should be Some(6)
    let x: Option<Option<number>> = Option.fromSome(Option.fromSome(6));
    expect(x.flatten().unwrap()).toBe(6);

    // Test case 2: Some(None).flatten() should be None
    x = Option.fromSome(Option.fromNone());
    expect(x.flatten().isNone()).toBe(true);

    // Test case 3: None.flatten() should be None
    x = Option.fromNone();
    expect(x.flatten().isNone()).toBe(true);
  }

  {
    // Test case 4: Some(Some(Some(6))).flatten() should be Some(Some(6))
    let x: Option<Option<Option<number>>> = Option.fromSome(
      Option.fromSome(Option.fromSome(6)),
    );
    expect(x.flatten().unwrap().unwrap()).toBe(6);

    let y = x.flatten();
    expect(y.flatten().unwrap()).toBe(6);
  }
});

test("Option.getOrInsert", () => {
  let x: Option<number> = Option.fromNone();

  {
    let y = x.getOrInsert(5);
    expect(y).toBe(5);

    x.insert(7);
  }

  expect(x.unwrap()).toBe(7);
});

test("Option.inspect with array get", () => {
  const list = [1, 2, 3];

  const x = Option.thenSome(list.length > 1, list[1])
    .inspect((x) => console.log(`got: ${x}`))
    .expect("list should be long enough");

  expect(x).toBe(2);

  Option.thenSome(list.length > 5, list[5]).inspect((x) => {
    console.log(`got: ${x}`);
  });
});

test("Option.isNone", () => {
  // Test case 1: Option is Some(2)
  let x: Option<number> = Option.fromNone();
  expect(x.isNone()).toBe(true);

  // Test case 2: Option is None
  x = Option.fromSome(10);
  expect(x.isNone()).toBe(false);
});

test("Option.isSome", () => {
  // Test case 1: Option is Some(2)
  let x: Option<number> = Option.fromSome(2);
  expect(x.isSome()).toBe(true);

  // Test case 2: Option is None
  x = Option.fromNone();
  expect(x.isSome()).toBe(false);
});

test("Option.isSomeAnd", () => {
  // Test case 1: Option is Some(2) and the predicate (x > 1) is true
  let x: Option<number> = Option.fromSome(2);
  expect(x.isSomeAnd((x) => x > 1)).toBe(true);

  // Test case 2: Option is Some(0) but the predicate (x > 1) is false
  x = Option.fromSome(0);
  expect(x.isSomeAnd((x) => x > 1)).toBe(false);

  // Test case 3: Option is None
  x = Option.fromNone();
  expect(x.isSomeAnd((x) => x > 1)).toBe(false);
});

test("Option.iter", () => {
  // Test case 1: Option is Some(4)
  let x: Option<number> = Option.fromSome(4);
  let iter = x.iter();
  let nextValue = iter.next();
  expect(nextValue.unwrap()).toBe(4);

  // Test case 2: Option is None
  x = Option.fromNone();
  iter = x.iter();
  expect(iter.next().isNone()).toBe(true);
});

test("Option.map", () => {
  let maybeSomeString = Option.fromSome("Hello, World!");
  let maybeSomeLen = maybeSomeString.map((s) => s.length);
  expect(maybeSomeLen.unwrap()).toBe(13);

  let x: Option<string> = Option.fromNone();
  expect(x.map((s) => s.length).isNone()).toBe(true);
});

test("Option.map_or", () => {
  let x = Option.fromSome("foo");
  expect(x.mapOr(42, (v) => v.length)).toBe(3);

  x = Option.fromNone();
  expect(x.mapOr(42, (v) => v.length)).toBe(42);
});

test("Option.map_or_else", () => {
  const k = 21;

  let x = Option.fromSome("foo");
  expect(
    x.mapOrElse(
      () => 2 * k,
      (v) => v.length,
    ),
  ).toBe(3);

  x = Option.fromNone();
  expect(
    x.mapOrElse(
      () => 2 * k,
      (v) => v.length,
    ),
  ).toBe(42);
});

test("Option.ok_or", () => {
  let x = Option.fromSome("foo");
  expect(x.okOr(0).unwrap()).toBe("foo");

  x = Option.fromNone();
  expect(x.okOr(0).isErr()).toBe(true);
  expect(x.okOr(0).unwrapErr()).toBe(0);
});

test("Option.ok_or_else", () => {
  let x = Option.fromSome("foo");
  expect(x.okOrElse(() => 0).unwrap()).toBe("foo");

  x = Option.fromNone();
  expect(x.okOrElse(() => 0).isErr()).toBe(true);
  expect(x.okOrElse(() => 0).unwrapErr()).toBe(0);
});

test("Option.or", () => {
  let x = Option.fromSome(2);
  let y: Option<number> = Option.fromNone();
  expect(x.or(y).unwrap()).toBe(2);

  x = Option.fromNone();
  y = Option.fromSome(100);
  expect(x.or(y).unwrap()).toBe(100);

  x = Option.fromSome(2);
  y = Option.fromSome(100);
  expect(x.or(y).unwrap()).toBe(2);

  x = Option.fromNone();
  y = Option.fromNone();
  expect(x.or(y).isNone()).toBe(true);
});

test("Option.or_else", () => {
  function nobody(): Option<string> {
    return Option.fromNone();
  }

  function vikings(): Option<string> {
    return Option.fromSome("vikings");
  }

  expect(Option.fromSome("barbarians").orElse(vikings).unwrap()).toBe(
    "barbarians",
  );
  expect(Option.fromNone().orElse(vikings).unwrap()).toBe("vikings");
  expect(Option.fromNone().orElse(nobody).isNone()).toBe(true);
});

test("Option.take", () => {
  let x = Option.fromSome(2);
  let y = x.take();
  expect(x.isNone()).toBe(true);
  expect(y.unwrap()).toBe(2);

  x = Option.fromNone();
  y = x.take();
  expect(x.isNone()).toBe(true);
  expect(y.isNone()).toBe(true);
});

test("Option.take_if", () => {
  let x = Option.fromSome(42);

  let prev = x.takeIf((_) => false);
  expect(x.unwrap()).toBe(42);
  expect(prev.isNone()).toBe(true);

  prev = x.takeIf((v) => v === 42);
  expect(x.isNone()).toBe(true);
  expect(prev.unwrap()).toBe(42);
});

test("Option.transpose", () => {
  class SomeErr {}

  let x: Result<Option<number>, SomeErr> = Result.fromOk(Option.fromSome(5));
  let y: Option<Result<number, SomeErr>> = Option.fromSome(Result.fromOk(5));
  expect(x).toEqual(y.transpose());
});

test("Option.unwrap", () => {
  let x = Option.fromSome("air");
  expect(x.unwrap()).toBe("air");

  try {
    let y: Option<string> = Option.fromNone();
    y.unwrap();
  } catch (e) {
    expect(e).toBe("called `Option.unwrap()` on a `None` value");
  }
});

test("Option.unwrap_or", () => {
  expect(Option.fromSome("car").unwrapOr("bike")).toBe("car");
  expect(Option.fromNone<string>().unwrapOr("bike")).toBe("bike");
});

test("Option.unwrap_or_else", () => {
  const k = 10;
  expect(Option.fromSome(4).unwrapOrElse(() => 2 * k)).toBe(4);
  expect(Option.fromNone<number>().unwrapOrElse(() => 2 * k)).toBe(20);
});

test("Option.unzip", () => {
  let x = Option.fromSome([1, "hi"] as [number, string]);
  let y = Option.fromNone<[number, string]>();

  expect(x.unzip()).toEqual([Option.fromSome(1), Option.fromSome("hi")]);
  expect(y.unzip()).toEqual([Option.fromNone(), Option.fromNone()]);
});

test("Option.xor", () => {
  let x = Option.fromSome(2);
  let y: Option<number> = Option.fromNone();
  expect(x.xor(y).unwrap()).toBe(2);

  x = Option.fromNone();
  y = Option.fromSome(2);
  expect(x.xor(y).unwrap()).toBe(2);

  x = Option.fromSome(2);
  y = Option.fromSome(2);
  expect(x.xor(y).isNone()).toBe(true);

  x = Option.fromNone();
  y = Option.fromNone();
  expect(x.xor(y).isNone()).toBe(true);
});

test("Option.zip", () => {
  let x = Option.fromSome(1);
  let y = Option.fromSome("hi");
  let z = Option.fromNone<number>();

  expect(x.zip(y).unwrap()).toEqual([1, "hi"]);
  expect(x.zip(z).isNone()).toBe(true);
});
