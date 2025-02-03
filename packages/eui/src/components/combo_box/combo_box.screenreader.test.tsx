/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React from 'react';
import { virtual } from '@guidepup/virtual-screen-reader';
import { waitFor } from '@testing-library/react';

import { waitForEuiPopoverOpen, render } from '../../test/rtl';
import { EuiComboBox } from './combo_box';
import { EuiSelect } from '../form/select';

interface Options {
  'data-test-subj'?: string;
  label: string;
  toolTipContent?: string;
  toolTipProps?: {};
}

const options: Options[] = [
  { label: 'Titan', 'data-test-subj': 'item-0' },
  { label: 'Enceladus', 'data-test-subj': 'item-1' },
  { label: 'Mimas', 'data-test-subj': 'item-2' },
  { label: 'Dione' },
  { label: 'Iapetus' },
  { label: 'Phoebe' },
  { label: 'Rhea' },
  { label: 'Pandora' },
  { label: 'Tethys' },
  { label: 'Hyperion' },
];

const selectOptions = [
  { value: 'item-0', text: 'Titan', 'data-test-subj': 'item-0' },
  { value: 'item-1', text: 'Enceladus', 'data-test-subj': 'item-1' },
  { value: 'item-2', text: 'Mimas', 'data-test-subj': 'item-2' },
  { value: 'item-3', text: 'Dione' },
  { value: 'item-4', text: 'Iapetus' },
  { value: 'item-5', text: 'Phoebe' },
  { value: 'item-6', text: 'Rhea' },
  { value: 'item-7', text: 'Pandora' },
  { value: 'item-8', text: 'Tethys' },
  { value: 'item-9', text: 'Hyperion' },
];

const props = {
  options,
  'aria-label': 'ComboBox aria-label',
};

const VIRTUAL_SCREEN_READER_PROPERTIES = {
  activeDescendent: 'active descendant',
  autocompleteList: 'autocomplete in list',
  isValid: 'not invalid',
  isInvalid: 'invalid',
  isExpanded: 'expanded',
  hasPopupListbox: 'has popup listbox',
};

const expectActiveSelectOption = async (
  lastSpokenPhrase: string,
  optionLabel: string
) => {
  const expectedString = `${VIRTUAL_SCREEN_READER_PROPERTIES.activeDescendent} ${optionLabel}`;

  const errorMessage = `
  lastSpokenPhrase should contain: "${expectedString}"
`;

  await waitFor(() => {
    expect(lastSpokenPhrase, errorMessage).toContain(expectedString);
  });
};

describe('EuiComboBox', () => {
  it('Should navigate the options', async () => {
    render(<EuiComboBox {...props} />);

    // Should have document.body context to ensure portalled elements are included (?)
    await virtual.start({ container: document.body });

    await waitFor(async () => {
      await virtual.next(); // move to combobox
      await virtual.press('Enter'); // open listbox
    });

    await waitForEuiPopoverOpen();

    await waitFor(async () => {
      await virtual.press('ArrowDown'); // move to 1st item
    });

    await expectActiveSelectOption(
      await virtual.lastSpokenPhrase(),
      options[0].label
    );

    await waitFor(
      async () => {
        await virtual.press('ArrowDown'); // move to 2nd item
        await virtual.press('ArrowDown'); // move to 3rd item
        await virtual.press('ArrowDown'); // move to 4th item
        await virtual.press('ArrowDown'); // move to 5th item
        await virtual.press('ArrowDown'); // move to 6th item
        await virtual.press('ArrowDown'); // move to 7th item
        await virtual.press('ArrowDown'); // move to 8th item
        await virtual.press('ArrowDown'); // move to 9th item
        await virtual.press('ArrowDown'); // move to 10th item
      },
      { timeout: 10000 }
    );

    await expectActiveSelectOption(
      await virtual.lastSpokenPhrase(),
      options[9].label
    );

    await virtual.stop();
  });
});

describe('EuiSelect', () => {
  it('Should navigate the options', async () => {
    render(<EuiSelect options={selectOptions} />);

    // Should have document.body context to ensure portalled elements are included
    await virtual.start({ container: document.body });

    await waitFor(async () => {
      await virtual.next(); // move to select
      await virtual.next(); // move to option

      // keyboard navigation doesn't work somehow
      // await virtual.press('Tab'); // move to select
      // await virtual.press('Space'); // move to 1st item
      // await virtual.press('ArrowDown'); // move to 1st item
    });

    await expect(
      (await virtual.lastSpokenPhrase()).includes(selectOptions[0].text)
    ).toEqual(true);

    await waitFor(async () => {
      await virtual.next(); // move to option
      await virtual.next(); // move to option
    });

    await virtual.stop();
  });
});
