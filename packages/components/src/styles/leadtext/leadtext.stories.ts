import '../../solid-components';

import { storybookDefaults, storybookHelpers, storybookTemplate } from '../../../scripts/storybook/helper';

const { argTypes, parameters } = storybookDefaults('sd-leadtext');
const { overrideArgs } = storybookHelpers('sd-leadtext');
const { generateTemplate } = storybookTemplate('sd-leadtext');

/**
 * Leadtext is used for text that should be highlighted and a focal point of the page. <br>
 * <br>
 * <b>Sizes</b><br>
 * <li>xl is the default size.</li>
 * <li>lg can be used as an alternative to xl.</li>
 */

export default {
  title: 'Styles/sd-leadtext',
  component: 'sd-leadtext',
  parameters: {
    ...parameters,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/G2kppjBPXzyQt6dFfGSPu2/Leadtext?type=design&node-id=755-5226&mode=design&t=8SvX76woqAGDbqn3-0'
    }
  },
  args: overrideArgs({ type: 'slot', name: 'default', value: 'Lorem Ipsum' }),
  argTypes
};

/**
 * Default: This shows sd-leadtext in its default state.
 */

export const Default = {
  render: (args: any) => {
    return generateTemplate({
      options: { templateContent: '<div class="%CLASSES%">%SLOT%</time>' },
      args
    });
  }
};

/**
 * Use the `inverted` class to make a leadtext with inverted colors.
 */

export const Inverted = {
  parameters: { controls: { exclude: ['sd-leadtext--inverted'] } },
  render: (args: any) => {
    return generateTemplate({
      axis: {
        y: [{ type: 'attribute', name: 'sd-leadtext--inverted', values: [false, true] }]
      },
      constants: { type: 'attribute', name: 'sd-leadtext--inverted', value: true },
      options: { templateBackgrounds: { alternate: 'y', colors: ['transparent', '#00358E'] } },
      args
    });
  }
};
