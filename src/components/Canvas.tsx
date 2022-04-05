import * as React from "react";
import { updateAwait } from "typescript";

interface CanvasProps {
  image: string;
  loading: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ image, loading }) => {
  return (
    <div className="preview-container">
      <img src={image} alt="preview" className="preview" />
      <Loading loading={loading} />
    </div>
  );
};

export default Canvas;

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
    <div className={"preview-loading " + (loading ? "visible" : "")}>
      <p>
        loading <br /> {dots(Math.floor(state / 25))}
      </p>
    </div>
  );
};
