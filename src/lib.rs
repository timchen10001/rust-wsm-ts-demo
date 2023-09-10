use std::vec;

use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
struct SnakeCell(usize, usize);

#[wasm_bindgen]
struct Snake {
    body: Vec<SnakeCell>,
}

impl Snake {
    pub fn new(spawn_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(spawn_index, spawn_index)],
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
    pub fn new() -> World {
        let width = 8;
        World {
            width,
            size: width * width,
            snake: Snake::new(10),
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
        self.snake.body[0].0 = (snake_idx - 1) % (self.size);
    }
}
