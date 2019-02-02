use celaut;
use celaut::diff_table::Table;
use celaut::{CellValue, CELAUT_SIZE, TABLE_SIZE};

fn acceptable_char(c: char) -> bool {
    c == '0' || c == '1' || c == '2' || c == '3'
}

fn cell_value_from_char(c: char) -> CellValue {
    match c {
        '0' => CellValue::Zero,
        '1' => CellValue::One,
        '2' => CellValue::Two,
        '3' => CellValue::Three,
        _ => panic!("cell_value_from_char called with invalid character"),
    }
}

pub fn table_from_str(src: &str) -> Result<Table, &'static str> {
    if src.len() != 49 {
        return Err("Expected exactly 25 characters");
    };
    if src.chars().any(|c| !acceptable_char(c)) {
        return Err("Unexpected characters: only 0, 1, 2, & 3 are allowed");
    };
    let src_values: Vec<CellValue> = src.chars().map(cell_value_from_char).collect();
    let mut tbl = [[CellValue::Zero; TABLE_SIZE]; TABLE_SIZE];
    for i in 0..TABLE_SIZE {
        for j in 0..TABLE_SIZE {
            tbl[i][j] = src_values[j * TABLE_SIZE + i];
        }
    }
    Ok(Table::new(tbl))
}

#[test]
fn test_table_from_str() {
    let src = "0223302003331222121130103120000103211332113202133";
    table_from_str(src).unwrap();
}

pub fn universe_from_str(src: &str) -> Result<celaut::Universe, &'static str> {
    if src.len() != CELAUT_SIZE {
        return Err("Expected exactly 128 characters");
    }
    let mut universe = [CellValue::Zero; CELAUT_SIZE];
    for (idx, cellval) in src.chars().map(cell_value_from_char).enumerate() {
        universe[idx] = cellval;
    }
    Ok(universe)
}

#[test]
fn test_universe_from_str() {
    let src = "13322312112013303223211001320220302102013331230322130200133020200210112200303020332111213131303221201233021000210131000330110130";
    universe_from_str(src).unwrap();
}
