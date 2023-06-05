import '../../solid-components';

import { storybookDefaults, storybookTemplate, storybookHelpers } from '../../../scripts/storybook/helper';

const { argTypes } = storybookDefaults('sd-radio-group');
const { generateTemplate } = storybookTemplate('sd-radio-group');
const { overrideArgs } = storybookHelpers('sd-radio-group');

export default {
  title: 'Components/sd-radio-group',
  component: 'sd-radio-group',
  args: overrideArgs({ type: 'slot', name: 'default', value: '<sd-radio value="1">Radio 1</sd-radio><sd-radio value="2">Radio 2</sd-radio><sd-radio value="3">Radio 3</sd-radio>' }),
  argTypes,
};


/**
 * Default: This shows sd-radio-group in its default state.
 */

export const Default = {
  render: (args: any) => {
    return generateTemplate({ args });
  }
};

/**
 * Default: This shows sd-radio-group in its default state.
 */

export const DefaultValue = {
  parameters: { controls: { exclude: ['value'] } },
  render: (args: any) => {
    return generateTemplate({
      constants: {type: 'attribute', name: 'value', value: 2},
      args
    })
  }
};


/**
 * Default: This shows sd-radio-group in its default state.
 */

export const LabelAttribute = {
  parameters: { controls: { exclude: ['label'] } },
  render: (args: any) => {
    return generateTemplate({
      constants: {type: 'attribute', name: 'label', value: 'Label'},
      args
    })
  }
};

/**
 * Default: This shows sd-radio-group in its default state.
 */

export const LabelSlot = {
  parameters: { controls: { exclude: ['label'] } },
  render: (args: any) => {
    return generateTemplate({
      constants: {type: 'slot', name: 'label', value: '<b slot="label">Label</b>'},
      args
    })
  }
};



/**
 * Default: This shows sd-radio-group in its default state.
 */

export const HelpTextAttribute = {
  parameters: { controls: { exclude: ['help-text'] } },
  render: (args: any) => {
    return generateTemplate({
      constants: {type: 'attribute', name: 'help-text', value: 'Help text'},
      args
    })
  }
};


/**
 * Default: This shows sd-radio-group in its default state.
 */

export const HelpTextSlot = {
  parameters: { controls: { exclude: ['help-text'] } },
  render: (args: any) => {
    return generateTemplate({
      constants: {type: 'slot', name: 'help-text', value: '<b slot="help-text">Help text</b>'},
      args
    })
  }
};

/**
 * Default: This shows sd-radio-group in its default state.
 */

export const Required = {
  parameters: { controls: { exclude: ['required', 'label'] } },
  render: (args: any) => {
    return generateTemplate({
      constants: [{type: 'attribute', name: 'required', value: true},
    {type: 'attribute', name: 'label', value: 'Required label'}],
      args
    })
  }
};