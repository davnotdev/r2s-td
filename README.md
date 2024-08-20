# RST3S-TD

I'm fed up with Javascript!
I want to make websites, but the builtin functions are painful to use!
Let's introduce some methods from a well designed language!

*ARR ESS TEE THREE ESS DASH TEE DEE*, also known as known as the RuSt TypeScript Stripped STandarD project is a library to reimplement functionality from Rust's `std::option`, `std::result`, and `std::iter` into Typescript.
To be clear, this is NOT a port from Rust.
There will be semantic differences (see below).

You're welcome.

Check [SUPPORT.md](./SUPPORT.md) for supported methods.

## Example

```typescript
import { Iterator, Result, Option } from "rst3s-td";

let a = Option.fromSome("Hello")              //  let a = Some("Hello".to_owned())
    .map((s) => s + " World")                 //      .map(|s| s + "World")
    .unwrap();                                //      .unwrap()

let b = Result.fromOk({ a: 10,  b: 20 })      //  let b = Ok(Data { a: 10, b: 20 })
    .map((obj) => obj.a)                      //      .map(|obj| obj.a)
    .iter()                                   //      .into_iter()
    .chain(Iterator.fromArray([4, 5, 6]));    //      .chain([4, 5, 6]);

for (let it of b) {
    console.log(it);
}

let c = Iterator.fromArray([1, 2, 3, 4, 5])   //  let c = ([1, 2, 3, 4, 5]).into_iter()
    .filter((x) => x % 2 != 0)                //      .filter(|x| x % 2 != 0)
    .map((x) => x * 2)                        //      .map(|x| x * 2)
    .zip(b)                                   //      .zip(b)
    .inspect(([a, b]) => console.log(a, b))   //      .inspect(|(a, b)| eprintln!("{} {}", a, b))
    .collect();                               //      .collect::<Vec<_>>(); 
```

## Notable Semantic Differences

### Iterators

Iterators are generally do not write to themselves.
For example:

Rust:
```rust
let a = [1, 2, 3];
let it = a.iter()
assert_eq!(Some(&1), iter.next());
assert_eq!(Some(&2), iter.next());
assert_eq!(Some(&3), iter.next());
```

This Library:
```typescript
let it = Iterator.fromArray([1, 2, 3]);
let it1 = it.next();    // it1 = 1 
let it2 = it1.next();   // it2 = 2
let it3 = it2.next();   // it3 = 3
let it4 = it.next();    // it4 = 1
```

### References

Rust and Javascript handle references and mutability quite differently.
Please be mindful that just because a closure is a mutable reference in the original, does not mean that this library will accurately capture that behavior. 

## Documentation

All methods use camel case, but otherwise, you can just use the [Rust `std` docs here](https://doc.rust-lang.org/stable/std/).

However, a few outlier methods are documented below.

```typescript
Option.then<T>(b: boolean, f: () => T): Option<T>
Option.thenSome<T>(b: boolean, v: T): Option<T>
Option.fromSome<T>(data: T): Option<T>
Option.fromNone<T>(): Option<T>

Result.fromOk<T, E>(data: T): Result<T, E>
Result.fromErr<T, E>(error: E): Result<T, E>

Iterator.fromArray<I>(array: Array<I>): Iterator<I>
```

