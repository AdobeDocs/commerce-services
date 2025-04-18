/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import '@spectrum-css/badge';
import '@spectrum-css/link';
import '@spectrum-css/tooltip';

const EDITIONS_LINK = 'https://experienceleague.adobe.com/en/docs/commerce';

const Edition = ({ name, showLearnMore = false, tooltip }) => {
  // Handle both string and object values for name prop
  const editionType = typeof name === 'object' ? name.type : name;
  const editionTooltip = typeof name === 'object' ? name.tooltip : tooltip;

  let editionText = '';
  let editionColor = '';

  switch (editionType) {
    case 'paas':
      editionText = 'PaaS';
      editionColor = 'spectrum-Badge--informative';
      break;
    case 'saas':
      editionText = 'SaaS';
      editionColor = 'spectrum-Badge--positive';
      break;
    case 'onprem':
      editionText = 'On-premises';
      editionColor = 'spectrum-Badge--neutral';
      break;
    default:
      editionText = 'Create an Edition tag';
      editionColor = 'spectrum-Badge--yellow';
  }

  return (
    <a 
      href={EDITIONS_LINK}
      className="spectrum-Link"
      target="_blank"
      rel="noreferrer"
      style={{ 
        textDecoration: 'none',
        display: 'inline-block',
        marginTop: '1rem',
        position: 'relative'
      }}
      title={editionTooltip}
    >
      <span 
        className={`spectrum-Badge spectrum-Badge--sizeS ${editionColor}`} 
        style={{ 
          paddingBottom: '4px',
          cursor: 'pointer'
        }}
      >
        {editionText}
        {showLearnMore && (
          <>&nbsp;.&nbsp;Learn more</>
        )}
      </span>
    </a>
  );
};

Edition.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      tooltip: PropTypes.string
    })
  ]),
  showLearnMore: PropTypes.bool,
  tooltip: PropTypes.string
};

export { Edition };