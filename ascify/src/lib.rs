use image::{GenericImageView, GrayImage};

pub struct Ramp {
    ramp: String,
}

impl Default for Ramp {
    fn default() -> Self {
        Self {
            ramp: "@%#*+=-:. ".into(),
        }
    }
}

impl<T> From<T> for Ramp
where
    T: Into<String>,
{
    fn from(ramp: T) -> Self {
        Self {
            ramp: ramp.into().chars().filter(|c| *c != '\n').collect(),
        }
    }
}

impl Ramp {
    pub fn reverse(&self) -> Self {
        Self {
            ramp: self.ramp.chars().rev().collect(),
        }
    }

    fn get_index(&self, brightness: f32) -> usize {
        let ramp_len = self.ramp.len();
        let index = brightness * ramp_len as f32;
        index as usize % self.ramp.len()
    }

    pub fn get_char(&self, brightness: f32) -> char {
        // SAFETY: index is always within 0..BRIGHTNESS_RAMP.len()
        unsafe {
            self.ramp
                .chars()
                .nth(self.get_index(brightness))
                .unwrap_unchecked()
        }
    }
}

pub fn ascify(ramp: &Ramp, image: &GrayImage, columns: u32) -> String {
    let mut out = String::with_capacity((image.width() as usize + 1) * image.height() as usize);

    let image = image::DynamicImage::ImageLuma8(image.clone());
    let image = image.resize_exact(
        columns,
        ((image.height() as f32 * (columns as f32 / image.width() as f32)) / 2.0) as u32,
        image::imageops::FilterType::Gaussian,
    );

    for (x, _y, val) in image.pixels() {
        out.push(ramp.get_char(val.0[0] as f32 / 255.0));

        if x == image.width() - 1 {
            out.push('\n');
        }
    }

    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn doesnt_go_out_of_range() {
        let ramp = Ramp::default();
        for i in 0..=255 {
            assert!(ramp.get_index(i as f32 / 255.0) < ramp.ramp.len());
        }
    }
}
