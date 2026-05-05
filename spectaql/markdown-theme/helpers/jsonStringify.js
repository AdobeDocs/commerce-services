'use strict';
const stringify = require('json-stringify-pretty-compact');

const SPECIAL_TAG_REGEX = /("?)SPECIALTAG("?)/g;
const QUOTE_TAG_REGEX = /QUOTETAG/g;

function cleanValue(value) {
  if (typeof value === 'string') {
    return value.replace(SPECIAL_TAG_REGEX, '').replace(QUOTE_TAG_REGEX, '');
  }
  if (Array.isArray(value)) return value.map(cleanValue);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = cleanValue(v);
    return out;
  }
  return value;
}

module.exports = function (json, _options) {
  if (!json) return '';
  return stringify(cleanValue(json), { indent: 2 });
};
