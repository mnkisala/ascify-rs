import * as React from "react";
import * as ascify from "../ascify";
import Form, { FormState } from "./Form";
import Preview from "./Preview";
import Copied from "./Copied";
import * as tauri from "@tauri-apps/api";
import { useSemaphore } from "./hooks/hooks";

interface AscifyOutput {
  text: string;
  preview: string;
}

function useAscify(
  after?: () => void
): [AscifyOutput, (args: ascify.RenderArgs) => void] {
  const [output, setOutput] = React.useState<string>("");
  const [preview, setPreview] = React.useState<string>("");

  const out: AscifyOutput = {
    text: output,
    preview,
  };

  const render = async ({
    data,
    columns,
    inverse,
    ramp,
  }: ascify.RenderArgs) => {
    const output = await ascify.render({ data, columns, inverse, ramp });
    setOutput(output);
    setPreview(
      `data:image/jpeg;charset=utf-8;base64,${await ascify.rasterize(
        output,
        inverse
      )}`
    );

    after && after();
  };

  return [out, render];
}

const DARK_THEME = {
  fg: "#f0f0f0",
  bg: "#202020",
  "bg-lighter": "#282828",
  "bg-acc": "#a2e",
  "fg-acc": "#f0f0f0",
};

const LIGHT_THEME = {
  fg: "#202020",
  bg: "#f0f0f0",
  "bg-lighter": "#ffffff",
  "fg-acc": "#f0f0f0",
};

const App = () => {
  const [formState, setFormState] = React.useState<FormState | null>(null);
  const [copiedState, setCopiedState] = React.useState<boolean>(false);
  const [loading, incLoading, decLoading] = useSemaphore();
  const [output, renderOutput] = useAscify(() => decLoading());

  const setTheme = useTheme(DARK_THEME);

  React.useEffect(() => {
    setTheme(formState?.light ? LIGHT_THEME : DARK_THEME);
  }, [formState, setTheme]);

  React.useEffect(() => {
    const callback = async () => {
      if (formState != null && formState.data != null) {
        incLoading();
        renderOutput({
          data: await formState.data,
          columns: formState.columns,
          inverse: formState.light,
          ramp: formState.ramp !== "" ? formState.ramp : undefined,
        });
      }
    };

    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  return (
    <div className="app-wrapper">
      <main>
        <Form onChange={setFormState} />

        <Preview image={output.preview} loading={loading} />

        <button
          onClick={() => {
            tauri.clipboard.writeText(output.text);
            setCopiedState(true);

            let clean: any = null;
            clean = setTimeout(() => {
              setCopiedState(false);
              clearTimeout(clean);
            }, 800);
          }}
        >
          Copy to clipboard
        </button>
      </main>

      {copiedState && <Copied />}
    </div>
  );
};

export default App;

function useTheme(init: Object): (next: Object) => void {
  const apply_theme = (theme: Object) => {
    for (let [k, v] of Object.entries(theme)) {
      document.documentElement.style.setProperty(`--${k}`, v);
    }
  };

  apply_theme(init);

  return (next) => {
    apply_theme(next);
  };
}
