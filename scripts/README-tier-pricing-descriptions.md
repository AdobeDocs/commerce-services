# Enhanced Tier Pricing Descriptions

This directory contains scripts for injecting enhanced type and field descriptions into the SpectaQL-generated Merchandising API documentation.

## Overview

The standard SpectaQL metadata overlay system wasn't applying our custom descriptions correctly, so we implemented a post-build processing approach that directly injects improved descriptions into the generated HTML.

## Files

### `inject-tier-pricing-descriptions.js`

Post-build script that adds enhanced descriptions for tier pricing related types:

- `ProductViewTierPrice` - Single tier in volume-based pricing
- `ProductViewPrice` - Complete pricing information
- `Price` - Monetary value with currency and adjustments
- `ProductViewMoney` - Monetary amount with currency
- `ProductViewTierRangeCondition` - Quantity range conditions
- `ProductViewTierExactMatchCondition` - Exact quantity conditions
- `ProductViewTierCondition` - Union type for conditions

### `build-merchandising-with-descriptions.js`

Enhanced build script that:

1. Runs the standard SpectaQL build
2. Automatically injects the enhanced descriptions

## Usage

### Enhanced Build (Recommended)

```bash
npm run build:merchandising-api:enhanced
```

This command will:

1. Generate the base documentation using SpectaQL
2. Automatically inject enhanced tier pricing descriptions
3. Output the final HTML with improved documentation

### Manual Description Injection

If you need to add descriptions to an existing HTML file:

```bash
node scripts/inject-tier-pricing-descriptions.js [path/to/file.html]
```

### Build Both APIs with Enhancements

```bash
npm run build:graphql:enhanced
```

## Description Content

All descriptions emphasize that this is a **read-only API** that returns existing pricing data configured in the commerce backend. Key themes:

- **Type descriptions** explain purpose and real-world usage
- **Field descriptions** include examples and context
- **Read-only focus** throughout all descriptions
- **Practical examples** showing quantity ranges and exact matches

## Customization

To modify descriptions, edit the `TYPE_DESCRIPTIONS` object in `inject-tier-pricing-descriptions.js`:

```javascript
const TYPE_DESCRIPTIONS = {
  'TypeName': {
    description: 'Enhanced type description...',
    fields: {
      'fieldName': 'Enhanced field description...'
    }
  }
};
```

## Technical Details

- **Pattern Matching**: Uses regex to find and replace descriptions in HTML
- **Safe Replacement**: Only modifies content within specific HTML structures
- **Validation**: Checks that types exist before attempting injection
- **Logging**: Provides detailed feedback on successful and failed injections

## Integration

The enhanced build process is integrated into the existing npm scripts:

- Original command: `build:merchandising-api`
- Enhanced command: `build:merchandising-api:enhanced`
- Both commands are available for flexibility
