import '../../solid-components';
import { getDefaultArgs, renderDefaultStory } from '../../../scripts/storybook/helper';

export default {
  title: 'Components/sd-select',
  component: 'sd-select',
};

// Renders the default story
export const Default = (args: any) => {
  return renderDefaultStory('sd-select', args);
};

// Sets the default args of the story
Default.args = {
  ...getDefaultArgs('sd-select')
};

// Sets the arg types of the story
Default.argTypes = {};
