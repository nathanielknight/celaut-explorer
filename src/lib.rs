use celaut;
use wasm_bindgen::prelude::*;

mod convert;

const IMAGE_DATA_SIZE: usize = celaut::CELAUT_SIZE * celaut::CELAUT_SIZE * 4;

struct CelautImageData<'a> {
    array: &'a mut [u8],
}

impl<'a> CelautImageData<'a> {
    fn new(array: &'a mut [u8]) -> Self {
        CelautImageData { array }
    }
}

fn to_pixel_data(cell: celaut::CellValue) -> [u8; 4] {
    const RATIO: f32 = 255.0 / (celaut::CELL_LIMIT - 1) as f32;
    let intensity = (RATIO * cell.to_f32()) as u8;
    let mut data: [u8; 4] = [255; 4];
    for idx in 0..3 {
        data[idx] = intensity;
    }
    data
}

impl<'a> celaut::render::Target for CelautImageData<'a> {
    fn set_value(&mut self, x: u32, y: u32, value: celaut::CellValue) {
        use celaut::CELAUT_SIZE;
        let start_idx: usize = (y * CELAUT_SIZE as u32 + x) as usize * 4;
        let pixel_data = to_pixel_data(value);
        for offset in 0..4 {
            self.array[start_idx + offset] = pixel_data[offset];
        }
    }
}

/// Exposed struct for driving the simulation from JavaScript
#[wasm_bindgen]
pub struct CelautApp {
    celaut: celaut::CelAut,
    rule_table: celaut::diff_table::Table,
}

#[wasm_bindgen]
impl CelautApp {
    #[wasm_bindgen(constructor)]
    pub fn new(seed_src: &str, table_src: &str) -> Self {
        let rule_table = convert::table_from_str(table_src).unwrap();
        let universe = convert::universe_from_str(seed_src).unwrap();
        let cel = celaut::CelAut::new(universe);
        CelautApp {
            celaut: cel,
            rule_table,
        }
    }

    #[wasm_bindgen]
    pub fn write_imagedata(&mut self, buffer: &mut [u8]) {
        assert!(buffer.len() == IMAGE_DATA_SIZE);
        let mut target = CelautImageData::new(buffer);
        celaut::render::render_evolution(&mut self.celaut, &self.rule_table, &mut target);
    }
}
