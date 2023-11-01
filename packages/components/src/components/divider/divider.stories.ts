import '../../solid-components';
import { html } from 'lit';
import { storybookDefaults, storybookTemplate } from '../../../scripts/storybook/helper';
const { args, argTypes, parameters } = storybookDefaults('sd-divider');
const { generateTemplate } = storybookTemplate('sd-divider');

export default {
  title: 'Components/sd-divider',
  component: 'sd-divider',
  args,

  argTypes,

  parameters: { ...parameters },
  decorators: [
    (story: () => typeof html) => html`
      <style>
        sd-divider[orientation='vertical'] {
          height: 120px;
        }

        sd-divider[orientation='horizontal'] {
          width: 120px;
        }

        .size-sm sd-divider[orientation='horizontal'] {
          width: 50px;
        }

        .size-sm sd-divider[orientation='vertical'] {
          height: 50px;
        }

        .size-l sd-divider[orientation='horizontal'] {
          width: 150px;
        }

        .size-l sd-divider[orientation='vertical'] {
          height: 150px;
        }
      </style>
      ${story()}
    `
  ]
};
/**
 * This shows sd-divider in its default state.
 */

export const Default = {
  render: (args: any) => {
    return generateTemplate({ args });
  }
};

/**
 * Use the orientation attribute to set the axis of a divider.
 */

export const Orientation = {
  parameters: { controls: { exclude: 'orientation' } },
  render: (args: any) => {
    return generateTemplate({
      axis: {
        y: { type: 'attribute', name: 'orientation' }
      },
      args
    });
  }
};

/**
 * Use the inverted attribute to make a divider with inverted colors.
 */

export const Inverted = {
  parameters: { controls: { exclude: 'inverted' } },
  render: (args: any) => {
    return generateTemplate({
      axis: {
        y: { type: 'attribute', name: 'inverted' }
      },
      args,
      options: {
        templateBackgrounds: { alternate: 'y', colors: ['rgb(var(--sd-color-primary, 0 53 142))', 'white'] }
      }
    });
  }
};

/**
 * You can set the component's size with `width` (horizontal) or `height` (vertical) via CSS or inline-styles.
 */

export const Sizes = {
  render: (args: any) => {
    return generateTemplate({
      axis: {
        x: {
          type: 'template',
          name: 'size',
          values: [
            {
              title: 'width: 50px',
              value: `<div class="size-sm"><sd-divider/><div>`
            },
            {
              title: 'width: 150px',
              value: `<div class="size-l"><sd-divider/><div>`
            },
            {
              title: 'height: 50px',
              value: `<div class="size-sm"><sd-divider orientation="vertical"/><div>`
            },
            {
              title: 'height: 150px',
              value: `<div class="size-l"><sd-divider orientation="vertical"/><div>`
            }
          ]
        }
      },
      args
    });
  }
};

/**
 * Use the `main` part selector to customize the divider.
 */

export const Parts = {
  render: (args: any) => {
    return generateTemplate({
      axis: {
        y: {
          type: 'template',
          name: 'sd-divider::part(...){outline: solid 2px red}',
          values: [
            {
              title: 'main',
              value: `<style>#part-main sd-divider::part(main){outline: solid 2px red }</style><div id="part-main">%TEMPLATE%</div>`
            }
          ]
        }
      },
      args
    });
  }
};
