import React, { useState, Fragment } from 'react';

import { EuiSwitch, EuiFormRow } from '../../../../src/components';
import { useGeneratedHtmlId } from '../../../../src/services';

export default () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const toggleTextSwitchId = useGeneratedHtmlId({ prefix: 'toggleTextSwitch' });

  const onChange1 = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setChecked1(e.target.checked);
  };

  const onChange2 = (e: {
    target: { checked: React.SetStateAction<boolean> };
  }) => {
    setChecked2(e.target.checked);
  };

  return (
    <Fragment>
      <EuiFormRow display="columnCompressed" label="Autoscaling">
        <EuiSwitch
          showLabel={false}
          label="Autoscaling"
          checked={checked1}
          onChange={onChange1}
          compressed
        />
      </EuiFormRow>
      <EuiFormRow
        display="columnCompressed"
        label={<span id={toggleTextSwitchId}>Show something</span>}
      >
        <EuiSwitch
          label={checked2 ? 'on' : 'off'}
          checked={checked2}
          onChange={onChange2}
          aria-describedby={toggleTextSwitchId}
          compressed
        />
      </EuiFormRow>
    </Fragment>
  );
};
