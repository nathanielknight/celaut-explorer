if (!(Test-Path -PathType Container "release")) {
    Write-Host "Creating output dir 'release'"
    New-Item -Type Directory "release"
}
else {
    Write-Host "Cleaning stale build out of 'release'"
    Get-ChildItem "release" | Remove-Item -Recurse
}

Write-Host "Building WASM from Rust"
cargo +nightly build --release --target wasm32-unknown-unknown

Write-Host "Creating celaut_explorer.js with wasm-bindgen"
wasm-bindgen --no-modules target/wasm32-unknown-unknown/release/celaut_explorer.wasm --out-dir ./release

Move-Item -Force -Path "./release/celaut_explorer.d.ts" -Destination "ts_src"

Write-Host "Compiling TypeScript"
tsc

Write-Host "Copying static files into 'release'"
Copy-Item -Force -Path "index.html" -Destination "./release/"
