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
pub struct SnakeCell(usize);

#[wasm_bindgen]
struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    pub fn new(spawn_index: usize, size: usize, direction: Direction) -> Snake {
        let mut body: Vec<SnakeCell> = vec![];

        for i in 0..size {
            body.push(SnakeCell(spawn_index - i));
        }

        Snake { body, direction }
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
    pub fn new(width: usize, spawn_index: usize, snake_size: usize, direction: Direction) -> World {
        World {
            width,
            size: width * width,
            snake: Snake::new(spawn_index, snake_size, direction),
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

    pub fn change_snake_direction(&mut self, next_direction: Direction) {
        self.snake.direction = next_direction
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr()
    }

    pub fn update(&mut self) {
        let next_cell = self.gen_next_snake_cell();
        self.snake.body[0] = next_cell;
        // let snake_idx = self.snake_head_idx();
        // let (row, col) = self.index_to_cell(snake_idx);

        // let (row, col) = match self.snake.direction {
        //     Direction::Right => {
        //         let next_col = (col + 1) % self.width;
        //         (row, next_col)
        //     }
        //     Direction::Left => {
        //         let next_col = if col > 0 {
        //             (col - 1) % self.width
        //         } else {
        //             self.width - 1
        //         };
        //         (row, next_col)
        //     }
        //     Direction::Up => {
        //         let next_row = if row > 0 {
        //             (row - 1) % self.width
        //         } else {
        //             self.width - 1
        //         };
        //         (next_row, col)
        //     }
        //     Direction::Down => {
        //         let next_row = (row + 1) % self.width;
        //         (next_row, col)
        //     }
        // };

        // let next_snake_head_idx = self.cell_to_index(row, col);
        // // log(format!("next_snake_head_idx: {}", next_snake_head_idx).as_str());
        // self.set_snake_head(next_snake_head_idx);
    }

    fn gen_next_snake_cell(&self) -> SnakeCell {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;

        return match self.snake.direction {
            Direction::Right => SnakeCell((row * self.width) + (snake_idx + 1) % self.width),
            Direction::Left => SnakeCell((row * self.width) + (snake_idx - 1) % self.width),
            Direction::Up => SnakeCell((snake_idx - self.width) % self.size),
            Direction::Down => SnakeCell((snake_idx + self.width) % self.size),
        };
    }
}

#[wasm_bindgen]
extern "C" {
    pub fn log(message: &str);
}
