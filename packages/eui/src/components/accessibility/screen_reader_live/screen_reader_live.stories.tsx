/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { EuiButton } from '../../button';
import {
  EuiScreenReaderLive,
  EuiScreenReaderLiveProps,
} from './screen_reader_live';

const meta: Meta<EuiScreenReaderLiveProps> = {
  title: 'Utilities/EuiScreenReaderLive',
  component: EuiScreenReaderLive,
  args: {
    // Component defaults
    role: 'status',
    isActive: true,
    focusRegionOnTextChange: false,
    type: 'update',
  },
  parameters: {
    loki: {
      // There are no visual elements to test
      skip: true,
    },
  },
};

export default meta;
type Story = StoryObj<EuiScreenReaderLiveProps>;

export const Playground: Story = {
  args: {
    children: 'You have new notifications',
  },
  render: function Render({ children, ...rest }) {
    const [announcement, setAnnoucement] = useState(children);

    const updateAnnouncementHandler = () => {
      setAnnoucement(
        `You have ${Math.floor(Math.random() * 100)} new notifications`
      );
    };

    return (
      <>
        <EuiButton onClick={updateAnnouncementHandler}>
          Update announcement
        </EuiButton>
        <EuiScreenReaderLive {...rest}>
          <p>{announcement}</p>
        </EuiScreenReaderLive>
      </>
    );
  },
};

export const AnnounceOnMount: Story = {
  args: {
    children: 'You have new notifications',
    type: 'mount',
  },
  render: function Render(args) {
    const [isActive, setIsActive] = useState(false);

    return (
      <>
        <EuiButton onClick={() => setIsActive((active) => !active)}>
          Toggle announcement
        </EuiButton>
        {isActive && <EuiScreenReaderLive {...args} />}
      </>
    );
  },
};

export const AnnounceOnMountAndUpdate: Story = {
  args: {
    children: 'You have new notifications',
    type: 'both',
    usePortal: true,
  },
  render: function Render({ children, ...rest }) {
    const [announcement, setAnnoucement] = useState(children);

    const updateAnnouncementHandler = () => {
      setAnnoucement(
        `You have ${Math.floor(Math.random() * 100)} new notifications`
      );
    };

    return (
      <>
        <EuiButton onClick={updateAnnouncementHandler}>
          Update announcement
        </EuiButton>
        <EuiScreenReaderLive {...rest}>
          <p>{announcement}</p>
        </EuiScreenReaderLive>
      </>
    );
  },
};
