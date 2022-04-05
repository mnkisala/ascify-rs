import * as React from "react";

function useSemaphore(): [boolean, () => void, () => void] {
  const [state, setState] = React.useState<number>(0);

  const inc = () => {
    setState((prev) => prev + 1);
  };

  const dec = () => {
    setState((prev) => prev - 1);
  };

  return [state > 0, inc, dec];
}

export { useSemaphore };
