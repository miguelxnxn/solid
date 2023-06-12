import '../../solid-components';
import { storybookDefaults, storybookTemplate } from '../../../scripts/storybook/helper';

const { argTypes, args, parameters } = storybookDefaults('sd-dropdown');
const { generateTemplate } = storybookTemplate('sd-dropdown');

export default {
  title: 'Components/sd-dropdown',
  component: 'sd-dropdown',
  args,
  argTypes,
  parameters: {...parameters},
};


/**
 * Default: This shows sd-dropdown in its default state.
 */

export const Default = {
  render: (args: any) => {
    return generateTemplate({ args });
  }
};
