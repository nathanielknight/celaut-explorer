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

if (Test-Path "release/celaut_explorer.d.ts") {
    Write-Host "Removing extraneous TypeScript definition files"
    Remove-Item -Path "release/celaut_explorer.d.ts"
}

Write-Host "Copying HTML into 'release'"
Copy-Item -Path "index.html" -Destination "./release/"
