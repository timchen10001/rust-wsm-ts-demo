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
struct SnakeCell(usize, usize);

#[wasm_bindgen]
struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    pub fn new(spawn_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn_index, spawn_index)],
            direction: Direction::Right,
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, spawn_index: usize) -> World {
        World {
            width,
            size: width * width,
            snake: Snake::new(spawn_index),
        }
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

    pub fn update(&mut self) {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;
        let col = snake_idx % self.width;

        // log(format!("row: {}", row).as_str());

        match self.snake.direction {
            Direction::Right => {
                let next_col = (col + 1) % self.width;
                self.snake.body[0].0 = (row * self.width) + next_col;
            }
            Direction::Left => {
                let next_col = if col > 0 {
                    (col - 1) % self.width
                } else {
                    self.width - 1
                };
                self.snake.body[0].0 = (row * self.width) + next_col;
            }
            Direction::Up => {
                let next_row = if row > 0 {
                    (row - 1) % self.width
                } else {
                    self.width - 1
                };
                self.snake.body[0].0 = (next_row * self.width) + col;
            }
            Direction::Down => {
                let next_row = (row + 1) % self.width;
                self.snake.body[0].0 = (next_row * self.width) + col;
            }
        }

        // if self.snake.direction == Direction::Right {
        //     let next_col = (snake_idx + 1) % self.width;
        //     // log(format!("next_col: {}", next_col).as_str());
        //     self.snake.body[0].0 = (row * self.width) + next_col;
        // }
        // if self.snake.direction == Direction::Left {
        //     let next_col = (snake_idx - 1) % self.width;
        //     self.snake.body[0].0 = (row * self.width) + next_col;
        // }
    }
}

#[wasm_bindgen]
extern "C" {
    pub fn log(message: &str);
}
