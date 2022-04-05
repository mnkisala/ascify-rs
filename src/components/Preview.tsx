import * as React from "react";

interface Props {
  image: string;
  loading: boolean;
}

const Preview: React.FC<Props> = ({ image, loading }) => {
  const [displayText, setDisplayText] = React.useState<boolean>(false);

  return (
    <div className="preview-container">
      {displayText && <div className="preview-text">[ preview ]</div>}
      <img
        src={image}
        alt="preview"
        onError={() => setDisplayText(true)}
        onLoad={() => setDisplayText(false)}
        className="preview"
      />
      <Loading loading={loading} />
    </div>
  );
};

export default Preview;

const Loading: React.FC<any> = ({ loading }) => {
  const [state, setState] = React.useState<number>(0);

  React.useEffect(() => {
    const f = async () => {
      for (;;) {
        setState((s) => (s + 1) % 100);
        clearTimeout(await new Promise((resolve) => setTimeout(resolve, 20)));
      }
    };

    f();
  }, []);

  const dots = (n: number) => {
    let out = "";
    for (let i = 0; i < n; i++) {
      out += ".";
    }
    return out;
  };

  return (
    <div
      className={
        "preview-loading-container " +
        (loading ? "preview-loading-container-visible" : "")
      }
    >
      <div className="preview-loading">
        loading <br /> {dots(Math.floor(state / 25))}
      </div>
    </div>
  );
};
