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

    let message = String::from("Hello");
    // let message_2 = message;

    // println!("1: {}, 2: {}", message_2, message);
    // let message_2 = print_message(message);

    // println!("{}", message_2);

    // let mut age = u8::from(20);
    // // let a: &mut u8 = &mut age;
    // extend_age(&mut age);

    // println!("new age: {}", age);

    let mut message = String::from("Hello");
    let message_3 = &message;
    println!("message_3: {}", message_3);
    let message_2 = &mut message;
    unpredictable_mutate(message_2);
    println!("message: {}", message);

    (* &mut message).push_str(" 123");
    println!("{}", message);
}

fn add(x: u32, y: u32) -> u32 {
    x + y
}

fn print_message(mut a: String) -> String {
    println!("{}", a);
    a.push_str("123");
    // let c = a;
    a
}

fn extend_age(age: &mut u8) {
    *age += 100;
    println!("inner age: {}", age);
}

fn unpredictable_mutate(val: &mut String) {
    val.push_str(" World");
}
