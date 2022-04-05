import * as React from "react";

import ImageDialogue from "./ImageDialogue";

interface FormState {
  data: Promise<string>;
  columns: number;
  ramp: string;
  lightMode: boolean;
}

interface FormProps {
  onChange: (state: FormState) => void;
}

const Form: React.FC<FormProps> = ({ onChange }) => {
  const [data, setData] = React.useState<Promise<string> | null>(null);
  const [columns, setColumns] = React.useState<number>(80);
  const [lightMode, setLightMode] = React.useState<boolean>(false);
  const [ramp, setRamp] = React.useState<string>("");
  const [showImageDialogue, setShowImageDialogue] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (data != null) {
      onChange({
        data,
        columns,
        ramp,
        lightMode,
      });
    }
  }, [data, columns, lightMode, ramp, onChange]);

  return (
    <div className="settings">
      {showImageDialogue || (
        <>
          <p>
            <button onClick={() => setShowImageDialogue(true)}>
              choose image
            </button>
          </p>

          <div className="settings-group">
            <label htmlFor="columns">columns</label>
            <input
              type="number"
              name="columns"
              value={columns}
              onChange={(e) => {
                setColumns(Number(e.target.value));
              }}
            />

            <label htmlFor="ramp">ramp</label>
            <input
              type="text"
              name="ramp"
              value={ramp}
              onChange={(e) => {
                setRamp(e.target.value);
              }}
            />

            <button onClick={() => setLightMode(!lightMode)}>
              {lightMode ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </>
      )}
      {showImageDialogue && (
        <ImageDialogue
          setData={setData}
          close={() => setShowImageDialogue(false)}
        />
      )}
    </div>
  );
};

export type { FormState, FormProps, Form };
export default Form;
