# RT3S-TD

I'm fed up with Javascript!
I want to make websites, but the builtin functions are painful to use!
Let's introduce some methods from a well designed language!

*ARR TEE THREE ESS DASH TEE DEE*, also known as known as the Rust TypeScript Stripped STandarD project is a library to reimplement the functionality of Rust's `std::option`, `std::result`, and `std::iter` into Typescript.

You're welcome.

Check [SUPPORT.md](./SUPPORT.md) for supported methods.

## Example

```typescript
import { Iterator, Result, Option } from "rt3s-td";


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

