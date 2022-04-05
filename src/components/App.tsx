import * as React from "react";
import * as ascify from "../ascify";
import Form, { FormState } from "./Form";
import Preview from "./Preview";
import * as tauri from "@tauri-apps/api";

const App = () => {
  const [formState, setFormState] = React.useState<FormState | null>(null);
  const [output, setOutput] = React.useState<string>("");
  const [copiedState, setCopiedState] = React.useState<boolean>(false);
  const [preview, setPreview] = React.useState<string>("");
  const [loading, setLoading] = React.useState<number>(0);

  React.useEffect(() => {
    const callback = async () => {
      if (formState != null) {
        console.log(["submitting...", formState]);

        setLoading((prev) => prev + 1);

        const output = await ascify.render(
          await formState.data,
          formState.columns,
          !formState.lightMode,
          formState.ramp !== "" ? formState.ramp : undefined
        );
        setOutput(output);
        setPreview(
          `data:image/jpeg;charset=utf-8;base64,${await ascify.rasterize(
            output,
            formState.lightMode
          )}`
        );

        setLoading((prev) => prev - 1);
      }
    };

    callback();
  }, [formState]);

  React.useEffect(() => {
    const callback = async () => {
      setPreview(
        `data:image/jpeg;charset=utf-8;base64,${await ascify.rasterize(
          "=| preview |=\n".repeat(1),
          false
        )}`
      );
    };
    callback();
  }, []);

  return (
    <div className="app-wrapper">
      <main>
        <Form onChange={setFormState} />

        <Preview image={preview} loading={loading > 0} />
        <button
          className="copy_to_cliboard_button"
          onClick={() => {
            tauri.clipboard.writeText(output);
            setCopiedState(true);

            setTimeout(() => {
              setCopiedState(false);
            }, 800);
          }}
        >
          copy to clipboard
        </button>
      </main>

      {copiedState && <Copied />}
    </div>
  );
};

const Copied = () => {
  return (
    <div className="copied">
      <p>copied!</p>
    </div>
  );
};

export default App;
