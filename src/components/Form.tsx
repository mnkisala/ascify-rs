import * as React from "react";

import ImageDialogue from "./ImageDialogue";

interface FormState {
  data: Promise<string> | null;
  columns: number;
  ramp: string;
  light: boolean;
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
    onChange({
      data,
      columns,
      ramp,
      light: lightMode,
    });
  }, [data, columns, lightMode, ramp, onChange]);

  return (
    <div className="settings">
      {showImageDialogue || (
        <>
          <div className="settings-group">
            <button onClick={() => setShowImageDialogue(true)}>
              Select image
            </button>
          </div>

          <div className="settings-group">
            <ColumnsInput
              value={columns}
              setValue={setColumns}
              onChange={(e) => setColumns(Number(e.target.value))}
            />

            <input
              type="text"
              name="ramp"
              value={ramp}
              placeholder="custom characterset"
              onChange={(e) => {
                setRamp(e.target.value);
              }}
            />

            <button onClick={() => setLightMode(!lightMode)}>
              {lightMode ? "Light" : "Dark"}
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

interface ColumnsInputProps {
  value: number;
  setValue: (cb: (p: number) => number) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

const ColumnsInput: React.FC<ColumnsInputProps> = ({
  value,
  setValue,
  onChange,
}) => {
  const input = React.useRef<HTMLInputElement>(null);

  return (
    <div className="columns_input-container">
      <input
        className="columns_input"
        type="number"
        name="columns"
        value={value}
        ref={input}
        onChange={onChange}
      ></input>
      <div className="columns_input-buttons">
        <button
          onClick={() => {
            setValue((v) => v + 1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            setValue((v) => v - 1);
          }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export type { FormState, FormProps, Form };
export default Form;
