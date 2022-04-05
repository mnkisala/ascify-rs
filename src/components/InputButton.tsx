import * as React from "react";

interface Props {
  onSubmit?: (value: string) => void;
  placeholder?: string;
  clearOnSubmit?: boolean;
}

const InputButton: React.FC<Props> = ({
  onSubmit,
  placeholder,
  clearOnSubmit,
  children,
}) => {
  const [value, setValue] = React.useState<string>("");

  return (
    <div className="input-button">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button
        onClick={() => {
          if (onSubmit != null) {
            onSubmit(value);
          }

          if (clearOnSubmit) {
            setValue("");
          }
        }}
      >
        {children}
      </button>
    </div>
  );
};

InputButton.defaultProps = {
  clearOnSubmit: false,
};

export default InputButton;
