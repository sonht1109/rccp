import { Meta } from "@storybook/react";
import Tooltip from "./Tooltip";

export default {
  title: "Tooltip",
  component: Tooltip,
} as Meta<typeof Tooltip>;

export const Default = () => {
  return (
    <div style={{ padding: 40, display: "flex", gap: 10 }}>
      <Tooltip
        label={<Tooltip.Label>Tooltip content</Tooltip.Label>}
        offset={10}
      >
        <button>Placement top</button>
      </Tooltip>
      <Tooltip
        placement="left"
        label={<Tooltip.Label>Tooltip content</Tooltip.Label>}
      >
        <button>Placement left</button>
      </Tooltip>
      <Tooltip
        placement="bottom"
        label={<Tooltip.Label>Tooltip content</Tooltip.Label>}
      >
        <button>Placement left</button>
      </Tooltip>
      <Tooltip
        placement="right"
        label={<Tooltip.Label>Tooltip content</Tooltip.Label>}
      >
        <button>Placement left</button>
      </Tooltip>
      <Tooltip
        delay={200}
        label={<Tooltip.Label>Tooltip content</Tooltip.Label>}
      >
        <button>Delay 200ms</button>
      </Tooltip>
      <Tooltip
        offset={20}
        label={<Tooltip.Label>Tooltip content</Tooltip.Label>}
      >
        <button>Offset 20px</button>
      </Tooltip>
      <Tooltip
        offset={20}
        label={<Tooltip.Label>Tooltip content</Tooltip.Label>}
        disabled
      >
        <button>Disabled</button>
      </Tooltip>
    </div>
  );
};
