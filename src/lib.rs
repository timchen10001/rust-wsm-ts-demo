use std::vec;

use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(PartialEq, Eq)]
pub enum Direction {
    Up,
    Right,
    Down,
    Left,
}

#[wasm_bindgen]
pub enum GameStatus {
    WON,
    LOSS,
    PLAYED,
}

#[wasm_bindgen]
#[derive(PartialEq, Clone, Copy)]
pub struct SnakeCell(usize);

#[wasm_bindgen]
struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
    next_cell: Option<SnakeCell>,
}

impl Snake {
    pub fn new(spawn_index: usize, size: usize, direction: Direction) -> Snake {
        let mut body: Vec<SnakeCell> = vec![];

        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Snake {
            body,
            direction,
            next_cell: Option::None,
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
    reward_cell: usize,
    status: Option<GameStatus>,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, spawn_index: usize, snake_size: usize, direction: Direction) -> World {
        let size = width * width;
        let snake = Snake::new(spawn_index, snake_size, direction);
        let reward_cell = World::gen_reward_cell(size, &snake.body);

        World {
            width,
            size,
            reward_cell,
            snake,
            status: None,
        }
    }

    fn gen_reward_cell(max: usize, snake_body: &Vec<SnakeCell>) -> usize {
        let mut reward_cell: usize;

        loop {
            reward_cell = randomInt(max);
            if !snake_body.contains(&SnakeCell(reward_cell)) {
                break;
            }
        }

        reward_cell
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn size(&self) -> usize {
        self.size
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn change_snake_direction(&mut self, next_direction: Direction) {
        let next_cell = self.gen_next_snake_head_cell(&next_direction);

        if self.snake_length() > 1 && self.snake.body[1].0 == next_cell.0 {
            return;
        }

        self.snake.next_cell = Option::Some(next_cell);
        self.snake.direction = next_direction
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn reward_cell(&self) -> usize {
        self.reward_cell
    }

    pub fn start_game(&mut self) {
        self.status = Some(GameStatus::PLAYED);
    }

    fn check_and_update_head(&mut self, next_head: &SnakeCell) -> bool {
        if self.snake.body.contains(&next_head) {
            self.status = Some(GameStatus::LOSS);
            notify("YOU LOSS!");
            false
        } else {
            self.snake.body[0] = *next_head;
            true
        }
    }

    pub fn update(&mut self) {
        match self.status {
            Some(GameStatus::PLAYED) => {
                let temp = self.snake.body.clone();
                let snake_cell_size = self.snake.body.len();
                let can_go_next: bool;

                match self.snake.next_cell {
                    Some(memoried_cell) => {
                        can_go_next = self.check_and_update_head(&memoried_cell);
                        self.snake.next_cell = None;
                    }
                    None => {
                        let next_head = self.gen_next_snake_head_cell(&self.snake.direction);
                        can_go_next = self.check_and_update_head(&next_head);
                    }
                }

                if !can_go_next {
                    return;
                }

                if snake_cell_size > 1 {
                    for i in 1..snake_cell_size {
                        self.snake.body[i] = SnakeCell(temp[i - 1].0);
                    }
                }

                // consume reward
                if self.reward_cell == self.snake_head_idx() {
                    if self.snake_length() < self.size {
                        self.reward_cell = World::gen_reward_cell(self.size, &self.snake.body);
                    } else {
                        self.status = Some(GameStatus::WON);
                        notify("You Won!");
                    }

                    self.snake
                        .body
                        .push(SnakeCell(self.snake.body[snake_cell_size - 1].0));
                }
            }
            _ => {}
        }
    }

    fn gen_next_snake_head_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;

        return match direction {
            Direction::Right => {
                let threshold = (row + 1) * self.width;
                if snake_idx + 1 == threshold {
                    SnakeCell(threshold - self.width)
                } else {
                    SnakeCell(snake_idx + 1)
                }
            }
            Direction::Left => {
                let threshold = row * self.width;
                if snake_idx == threshold {
                    SnakeCell(threshold + (self.width - 1))
                } else {
                    SnakeCell(snake_idx - 1)
                }
            }
            Direction::Up => {
                let threshold = snake_idx - (row * self.width);
                if snake_idx == threshold {
                    SnakeCell((self.size - self.width) + threshold)
                } else {
                    SnakeCell(snake_idx - self.width)
                }
            }
            Direction::Down => {
                let threshold = snake_idx + ((self.width - row) * self.width);
                if snake_idx + self.width == threshold {
                    SnakeCell(threshold - ((row + 1) * self.width))
                } else {
                    SnakeCell(snake_idx + self.width)
                }
            }
        };
    }
}

#[wasm_bindgen(module = "/www/utils/js2rust.js")]
extern "C" {
    pub fn log(message: &str);
    pub fn randomInt(max: usize) -> usize;
    pub fn notify(message: &str);
}
