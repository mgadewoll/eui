import React, { useState } from 'react';

import { EuiFilterGroup, EuiFilterButton } from '../../../../src/components';
import { DisplayToggles } from '../form_controls/display_toggles';

export default () => {
  const [isFilterOn, setIsFilterOn] = useState(false);
  const [isOnFilterOn, setIsOnFilterOn] = useState(false);
  const [isOffFilterOn, setIsOffFilterOn] = useState(false);

  const toggleFilter = () => {
    setIsFilterOn(!isFilterOn);
  };

  const toggleOnFilter = () => {
    setIsOnFilterOn(!isOnFilterOn);
    setIsOffFilterOn(isOffFilterOn && !isOnFilterOn ? false : isOffFilterOn);
  };

  const toggleOffFilter = () => {
    setIsOffFilterOn(!isOffFilterOn);
    setIsOnFilterOn(isOnFilterOn && !isOffFilterOn ? false : isOnFilterOn);
  };

  return (
    <DisplayToggles
      canDisabled={false}
      canReadOnly={false}
      canLoading={false}
      canInvalid={false}
      canFullWidth
    >
      <EuiFilterGroup>
        <EuiFilterButton
          hasActiveFilters={isFilterOn}
          isSelected={isFilterOn}
          onClick={toggleFilter}
          isToggle
        >
          Single filter
        </EuiFilterButton>
        <EuiFilterButton
          withNext
          hasActiveFilters={isOnFilterOn}
          isSelected={isOnFilterOn}
          onClick={toggleOnFilter}
          isToggle
        >
          On
        </EuiFilterButton>
        <EuiFilterButton
          hasActiveFilters={isOffFilterOn}
          isSelected={isOffFilterOn}
          onClick={toggleOffFilter}
          isToggle
        >
          Off
        </EuiFilterButton>
      </EuiFilterGroup>
    </DisplayToggles>
  );
};
