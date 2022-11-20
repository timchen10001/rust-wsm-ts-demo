fn main() {
    // let custom_num = 98_000;
    // let hex_num = 0xfa;
    // let bin_num = 0b111;
    // let byte_num = b'A';

    // println!("{}", custom_num);
    // println!("{}", hex_num);
    // println!("{}", bin_num);
    // println!("{}", byte_num);

    // let float_num: f32 = 3.14;
    // let float_num_2: f64 = 3.2333333333333333333;

    // let tup: (i32, &str, u8) = (10, "Hello", 1);

    // println!("{}", tup.1);
    // let (a, b, c) = tup;

    // println!("a: {}, b: {}", a, b);

    // let x = [1, 2, 4, 5];

    // println!("x[0]: {}", x[0]);

    let a = 10;
    let b = a;
    let c = 15;
    let sum = add(a, b);

    println!("{}", sum);

}

fn add(x: u32, y: u32) -> u32 {
    x + y
}