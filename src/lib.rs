mod another_mod;

use another_mod::another_mod2;

pub fn aaa() {
    another_mod2::test();
}

pub mod LearnRust {
    pub mod NestedModule {
        pub fn say_hi() {
            println!("Hello World!");
        }
    }

    pub trait Log {
        fn display_info(&self) -> String;
    }

    #[derive(Debug)]
    pub enum PersonalId {
        Passport(String),
        IdentityCard(u32, u32, u32),
    }

    impl std::fmt::Display for PersonalId {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            match self {
                PersonalId::Passport(value) => {
                    write!(f, "{}", if value.is_empty() { "EMPTY" } else { value })
                }
                PersonalId::IdentityCard(x, y, z) => write!(f, "{}-{}-{}", x, y, z),
            }
        }
    }

    pub struct Person {
        pub id: PersonalId,
        pub first_name: String,
        pub last_name: String,
        pub age: u32,
    }

    impl std::fmt::Display for Person {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(
                f,
                "Id: {}\nName: {} {}\nAge: {}",
                self.id, self.first_name, self.last_name, self.age
            )
        }
    }

    impl Log for Person {
        fn display_info(&self) -> String {
            let result = format!(
                "Id: {}\nName: {} {}\nAge: {}",
                self.id, self.first_name, self.last_name, self.age
            );
            println!("{}", result);
            result
        }
    }

    impl Person {
        pub fn new() -> Person {
            Person {
                id: PersonalId::Passport("".to_string()),
                first_name: "DEFAULT_FIRST_NAME".to_string(),
                last_name: "DEFAULT_LAST_NAME".to_string(),
                age: 0,
            }
        }

        pub fn from(id: PersonalId, first_name: String, last_name: String, age: u32) -> Person {
            Person {
                id,
                first_name,
                last_name,
                age,
            }
        }

        pub fn change_age(&mut self, next_age: u32) {
            self.age = next_age;
        }
    }

    pub fn log_1(val: impl Log) {
        NestedModule::say_hi();
        val.display_info();
        super::aaa()
    }

    pub fn log_2(val: &dyn Log) {
        val.display_info();
        crate::another_mod::another_mod2::test();
    }
}
