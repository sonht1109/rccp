import { Meta, StoryFn } from "@storybook/react";
import LazyImage from "./LazyImage";

export default {
  title: "LazyImage",
  component: LazyImage,
  tags: ['autodocs']
} as Meta<typeof LazyImage>;

const Template: StoryFn<typeof LazyImage> = (args: any) => (
  <LazyImage {...args} />
);

export const Default = Template.bind({});
Default.args = {
  src: "https://via.placeholder.com/300",
  alt: "Placeholder image",
  width: 300,
  height: 300,
  placeholderSrc: ""
};