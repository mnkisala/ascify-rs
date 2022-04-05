use clap::Parser;
use image::GrayImage;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    /// path to an input image
    #[clap(short, long)]
    path: String,

    /// columns in the output
    #[clap(short, long, default_value_t = 80)]
    columns: u32,

    /// whether to invert the brightness
    #[clap(short, long)]
    invert: bool,

    /// custom ramp file
    #[clap(short, long)]
    ramp: Option<String>,
}

fn read_image(path: &str) -> Option<GrayImage> {
    match image::io::Reader::open(path) {
        Ok(img) => Some(img.decode().unwrap().to_luma8()),
        Err(_) => match reqwest::blocking::get(path).unwrap().bytes() {
            Ok(bytes) => Some(image::load_from_memory(&bytes).unwrap().to_luma8()),
            Err(_) => None,
        },
    }
}

fn main() {
    let args = Args::parse();

    let img = read_image(&args.path).unwrap();

    let ramp = if let Some(ramp) = args.ramp {
        if let Ok(buf) = std::fs::read_to_string(&ramp) {
            ascify::Ramp::from(buf)
        } else {
            let ramp_dir = match std::env::var("ASCIFY_RAMP_DIR") {
                Ok(dir) => dir,
                Err(_) => format!(
                    "{}/.local/share/ascify/ramps",
                    std::env::var("HOME").unwrap()
                ),
            };
            let path = format!("{}/{}", ramp_dir, ramp);
            if let Ok(buf) = std::fs::read_to_string(&path) {
                ascify::Ramp::from(buf)
            } else {
                eprintln!("No ramp \"{}\" found!", &ramp);
                std::process::exit(1);
            }
        }
    } else {
        ascify::Ramp::default()
    };

    let ramp = match args.invert {
        true => ramp.reverse(),
        false => ramp,
    };

    let out = ascify::ascify(&ramp, &img, args.columns);
    print!("{}", out);
}
