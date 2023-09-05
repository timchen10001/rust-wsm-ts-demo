use snake_game::LearnRust::*;

fn main() {
    let mut tim = Person {
        id: PersonalId::IdentityCard(234, 5634, 4958),
        first_name: "Tim".to_string(),
        last_name: "Chen".to_string(),
        age: 20,
    };

    tim.change_age(40);

    let mut dynamic_user = Person::new();
    dynamic_user.first_name = "123".to_string();

    log_2(&tim);
    // log_1(tim);
    log_1(dynamic_user);
}
