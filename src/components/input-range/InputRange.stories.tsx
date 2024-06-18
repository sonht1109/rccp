import { Meta } from "@storybook/react";
import InputRange from "./InputRange";
import { useState } from "react";

export default {
  title: "InputRange",
  component: InputRange,
} as Meta<typeof InputRange>;

export const Default = () => {
  const [value, setValue] = useState(50);
  return (
    <div style={{ padding: 40, display: "flex", gap: 10 }}>
      <InputRange
        range={{ min: 0, max: 100 }}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};
