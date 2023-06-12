import '../../solid-components';
import { storybookDefaults, storybookTemplate } from '../../../scripts/storybook/helper';

const { argTypes, args, parameters } = storybookDefaults('sd-breadcrumb-item');
const { generateTemplate } = storybookTemplate('sd-breadcrumb-item');

export default {
  title: 'Components/sd-breadcrumb-item',
  component: 'sd-breadcrumb-item',
  args,
  argTypes,
  parameters: {...parameters},
};


/**
 * Default: This shows sd-breadcrumb-item in its default state.
 */

export const Default = {
  render: (args: any) => {
    return generateTemplate({ args });
  }
};
