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

const EditionBadge = ({ type, tooltip, showLearnMore = false }) => {
  let editionText = '';
  let editionColor = '';

  switch (type) {
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
        marginRight: '0.5rem',
        position: 'relative'
      }}
      title={tooltip}
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

const Edition = ({ name, showLearnMore = false, tooltip }) => {
  // Convert input to array of edition objects
  const editions = Array.isArray(name) 
    ? name 
    : typeof name === 'object' 
      ? [name] 
      : [{ type: name, tooltip }];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
      {editions.map((edition, index) => (
        <EditionBadge
          key={`${edition.type || edition}-${index}`}
          type={typeof edition === 'object' ? edition.type : edition}
          tooltip={typeof edition === 'object' ? edition.tooltip : tooltip}
          showLearnMore={showLearnMore}
        />
      ))}
    </div>
  );
};

EditionBadge.propTypes = {
  type: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  showLearnMore: PropTypes.bool
};

Edition.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      tooltip: PropTypes.string
    }),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          tooltip: PropTypes.string
        })
      ])
    )
  ]),
  showLearnMore: PropTypes.bool,
  tooltip: PropTypes.string
};

export { Edition };