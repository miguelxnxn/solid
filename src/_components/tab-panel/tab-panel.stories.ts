import '../../solid-components';
import { storybookDefaults, storybookTemplate } from '../../../scripts/storybook/helper';

const { argTypes, args, parameters } = storybookDefaults('sd-tab-panel');
const { generateTemplate } = storybookTemplate('sd-tab-panel');

export default {
  title: 'Components/sd-tab-panel',
  component: 'sd-tab-panel',
  args,
  argTypes,
  parameters: {...parameters},
};


/**
 * Default: This shows sd-tab-panel in its default state.
 */

export const Default = {
  render: (args: any) => {
    return generateTemplate({ args });
  }
};
