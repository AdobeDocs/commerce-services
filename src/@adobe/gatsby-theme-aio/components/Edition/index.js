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

let editionText = '';
let editionColor = '';
const EDITIONS_LINK = 'https://docs.magento.com/user-guide/getting-started.html#product-editions';

const Edition = ({ ...props }) => {
  switch (props.name) {
    case 'paas':
      editionText = 'PaaS';
      editionColor = 'spectrum-Badge--informative';
      break;
    case 'saas':
      editionText = 'SaaS';
      editionColor = 'spectrum-Badge--positive';
      break;
    default:
      editionText = 'Create an Edition tag';
      editionColor = 'spectrum-Badge--yellow';
  }

  return (
    <span class={`spectrum-Badge spectrum-Badge--sizeS ${editionColor}`} style={{ paddingBottom: '4px' }}>
      {editionText}.&nbsp;
      <a href={`${EDITIONS_LINK}`} class="spectrum-Link spectrum-Link--overBackground" target="_blank" rel="noreferrer">
        Learn more
      </a>
    </span>
  );
};

Edition.propTypes = {
  name: PropTypes.string
};

export { Edition };