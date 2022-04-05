use image::{Rgb, RgbImage};
use imageproc::drawing::{draw_text_mut, text_size};
use rusttype::{Font, Scale};

pub fn rasterize(input: &str, light: bool) -> image::DynamicImage {
    let mut image = RgbImage::new(640, 640);
    if light {
        image.fill(250);
    } else {
        image.fill(5);
    }

    let font = Vec::from(include_bytes!("VeraMono.ttf") as &[u8]);
    let font = Font::try_from_vec(font).unwrap();

    let input: Vec<&str> = input.split('\n').collect();

    let (w, h) = text_size(Scale { x: 1.0, y: 1.0 }, &font, &input[0]);

    let width = w as f32;
    let height = (h as usize * input.len()) as f32;
    let scale = (640.0 / width).min(640.0 / height);
    let scale = Scale { x: scale, y: scale };
    let width = width * scale.x;
    let height = height * scale.y;

    let padding_r = (640.0 - width) / 2.0;
    let padding_t = (640.0 - height) / 2.0;

    let color = if light {
        Rgb([0u8, 0u8, 0u8])
    } else {
        Rgb([255u8, 255u8, 255u8])
    };

    for (index, line) in input.iter().enumerate() {
        draw_text_mut(
            &mut image,
            color,
            padding_r as i32,
            padding_t as i32 + ((index as i32 * h) as f32 * scale.x) as i32,
            scale,
            &font,
            line,
        );
    }

    image.into()
}
