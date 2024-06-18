import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["storybook-addon-react-docgen", "@storybook/addon-essentials"],
};

export default config;
