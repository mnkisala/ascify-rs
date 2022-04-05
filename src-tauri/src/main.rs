#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use image::ImageOutputFormat;

#[tauri::command]
async fn ascify(data: String, columns: u32, inverse: bool, ramp: Option<String>) -> String {
    let buffer = base64::decode(&data).unwrap();

    let image = image::load_from_memory(&buffer)
        .and_then(|image| Ok(image.to_luma8()))
        .ok();

    // let ramp = ascify::Ramp::default().reverse();

    let ramp = if let Some(ramp) = ramp {
        ascify::Ramp::from(ramp)
    } else {
        ascify::Ramp::default()
    };

    let ramp = if inverse { ramp.reverse() } else { ramp };

    if let Some(image) = image {
        tokio::spawn(async move { ascify::ascify(&ramp, &image, columns) })
            .await
            .unwrap()
    } else {
        eprintln!("failed to load the image!");
        String::from("")
    }
}

#[tauri::command]
async fn rasterize(data: String, light: bool) -> String {
    let mut out = Vec::new();
    let mut cursor = std::io::Cursor::new(&mut out);
    app::rasterize(&data, light)
        .write_to(&mut cursor, ImageOutputFormat::Jpeg(50))
        .unwrap();
    base64::encode(out)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ascify, rasterize])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
