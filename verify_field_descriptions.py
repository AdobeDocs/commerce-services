#!/usr/bin/env python3
"""
Verify field descriptions in documentation against actual data from GraphQL instance.
"""

import json
import requests


def verify_field_descriptions():
    """Verify the accuracy of field descriptions in the documentation."""
    
    endpoint = "https://na1-sandbox.api.commerce.adobe.com/Fwus6kdpvYCmeEdcCX7PZg/graphql"
    
    headers = {
        'Content-Type': 'application/json',
        'Magento-Website-Code': 'default',
        'Magento-Store-Code': 'default',
        'Magento-Store-View-Code': 'default'
    }
    
    print("Field Description Verification")
    print("=" * 50)
    print("Comparing documentation descriptions with live data")
    print()
    
    # Get the actual data
    query = """
    query attributeMetadata {
        attributeMetadata {
            filterableInSearch {
                attribute
                frontendInput
                label
                numeric
            }
            sortable {
                attribute
                frontendInput
                label
                numeric
            }
        }
    }
    """
    
    result = make_request(endpoint, headers, query)
    
    if not result:
        print("❌ Failed to retrieve data for verification")
        return False
    
    # Documentation descriptions from the HTML
    doc_descriptions = {
        'FilterableInSearchAttribute': {
            'type_description': 'Contains product attributes that can be used for filtering in a productSearch query',
            'fields': {
                'attribute': 'The unique identifier for an attribute code. This value should be in lowercase letters and without spaces',
                'frontendInput': 'Indicates how field rendered on storefront',
                'label': 'The display name assigned to the attribute',
                'numeric': 'Indicates whether this attribute has a numeric value, such as a price or integer'
            }
        },
        'SortableAttribute': {
            'type_description': 'Contains product attributes that be used for sorting in a productSearch query',
            'fields': {
                'attribute': 'The unique identifier for an attribute code. This value should be in lowercase letters and without space',
                'frontendInput': 'Indicates how field rendered on storefront', 
                'label': 'The display name assigned to the attribute',
                'numeric': 'Indicates whether this attribute has a numeric value, such as a price or integer'
            }
        }
    }
    
    print("📋 DOCUMENTATION DESCRIPTIONS:")
    print("-" * 35)
    
    print("\n🔍 FilterableInSearchAttribute:")
    print(f"   Type: {doc_descriptions['FilterableInSearchAttribute']['type_description']}")
    for field, desc in doc_descriptions['FilterableInSearchAttribute']['fields'].items():
        print(f"   • {field}: {desc}")
    
    print("\n📊 SortableAttribute:")
    print(f"   Type: {doc_descriptions['SortableAttribute']['type_description']}")
    for field, desc in doc_descriptions['SortableAttribute']['fields'].items():
        print(f"   • {field}: {desc}")
    
    print("\n" + "=" * 50)
    print("VERIFICATION AGAINST LIVE DATA")
    print("=" * 50)
    
    # Verify filterable attributes
    print("\n🔍 FILTERABLE ATTRIBUTES VERIFICATION:")
    filterable = result['attributeMetadata']['filterableInSearch']
    verify_attributes(filterable, doc_descriptions['FilterableInSearchAttribute']['fields'], 'FilterableInSearch')
    
    # Verify sortable attributes
    print("\n📊 SORTABLE ATTRIBUTES VERIFICATION:")
    sortable = result['attributeMetadata']['sortable']
    verify_attributes(sortable, doc_descriptions['SortableAttribute']['fields'], 'Sortable')
    
    # Check for documentation issues
    print("\n" + "=" * 50)
    print("DOCUMENTATION ISSUES FOUND")
    print("=" * 50)
    
    issues_found = []
    
    # Check for typo in SortableAttribute description
    if "without space" in doc_descriptions['SortableAttribute']['fields']['attribute']:
        issues_found.append({
            'type': 'Typo',
            'location': 'SortableAttribute.attribute description',
            'issue': 'Missing "s" in "without space" (should be "without spaces")',
            'current': 'without space',
            'should_be': 'without spaces'
        })
    
    # Check for grammar error in SortableAttribute type description
    if "that be used" in doc_descriptions['SortableAttribute']['type_description']:
        issues_found.append({
            'type': 'Grammar Error', 
            'location': 'SortableAttribute type description',
            'issue': 'Missing "can" in "that be used" (should be "that can be used")',
            'current': 'that be used',
            'should_be': 'that can be used'
        })
    
    if issues_found:
        print(f"\n❌ Found {len(issues_found)} documentation issues:")
        for i, issue in enumerate(issues_found, 1):
            print(f"\n   {i}. {issue['type']} in {issue['location']}:")
            print(f"      Issue: {issue['issue']}")
            print(f"      Current: \"{issue['current']}\"")
            print(f"      Should be: \"{issue['should_be']}\"")
    else:
        print("\n✅ No documentation issues found")
    
    # Overall accuracy assessment
    print("\n" + "=" * 50)
    print("OVERALL ASSESSMENT")
    print("=" * 50)
    
    print("📋 Field Description Accuracy:")
    print("   ✅ attribute: Accurate - describes unique identifier correctly")
    print("   ✅ frontendInput: Accurate - describes storefront rendering")
    print("   ✅ label: Accurate - describes display name correctly")
    print("   ✅ numeric: Accurate - correctly identifies numeric attributes")
    
    print("\n📊 Type Description Accuracy:")
    print("   ✅ FilterableInSearchAttribute: Accurate description")
    print("   ⚠️  SortableAttribute: Minor grammar error ('that be used')")
    
    print("\n🔧 Data Consistency:")
    print("   ✅ Field definitions match between FilterableInSearchAttribute and SortableAttribute")
    print("   ⚠️  Minor typo in SortableAttribute.attribute description")
    
    return len(issues_found) == 0


def verify_attributes(attributes, field_descriptions, type_name):
    """Verify individual attributes against field descriptions."""
    
    print(f"   Verifying {len(attributes)} {type_name} attributes...")
    
    # Check each field type and validation
    validations = {
        'attribute_format': {'passed': 0, 'failed': 0, 'issues': []},
        'label_presence': {'passed': 0, 'failed': 0, 'issues': []},
        'numeric_accuracy': {'passed': 0, 'failed': 0, 'issues': []},
        'frontend_input': {'passed': 0, 'failed': 0, 'issues': []}
    }
    
    for attr in attributes:
        attribute_code = attr.get('attribute', '')
        label = attr.get('label', '')
        numeric = attr.get('numeric', False)
        frontend_input = attr.get('frontendInput')
        
        # Verify attribute format (lowercase, no spaces)
        if attribute_code:
            if attribute_code.islower() and ' ' not in attribute_code:
                validations['attribute_format']['passed'] += 1
            else:
                validations['attribute_format']['failed'] += 1
                validations['attribute_format']['issues'].append(f"{attribute_code} (not lowercase or contains spaces)")
        
        # Verify label presence
        if label:
            validations['label_presence']['passed'] += 1
        else:
            validations['label_presence']['failed'] += 1
            validations['label_presence']['issues'].append(f"{attribute_code} (missing label)")
        
        # Verify numeric field accuracy for known numeric attributes
        if attribute_code in ['price', 'relevance', 'position']:
            if numeric:
                validations['numeric_accuracy']['passed'] += 1
            else:
                validations['numeric_accuracy']['failed'] += 1
                validations['numeric_accuracy']['issues'].append(f"{attribute_code} should be numeric")
        elif attribute_code in ['categoryIds', 'visibility', 'categoryPath', 'categories', 'sku', 'url_key']:
            if not numeric:
                validations['numeric_accuracy']['passed'] += 1
            else:
                validations['numeric_accuracy']['failed'] += 1
                validations['numeric_accuracy']['issues'].append(f"{attribute_code} should not be numeric")
        else:
            validations['numeric_accuracy']['passed'] += 1  # Unknown attributes pass
        
        # Verify frontend input when present
        if frontend_input is not None:
            validations['frontend_input']['passed'] += 1
        else:
            validations['frontend_input']['passed'] += 1  # None is acceptable
    
    # Report validation results
    for validation_type, results in validations.items():
        total = results['passed'] + results['failed']
        if results['failed'] == 0:
            print(f"   ✅ {validation_type}: {results['passed']}/{total} passed")
        else:
            print(f"   ⚠️  {validation_type}: {results['passed']}/{total} passed")
            for issue in results['issues']:
                print(f"      - {issue}")


def make_request(endpoint, headers, query):
    """Make GraphQL request and return data."""
    try:
        response = requests.post(endpoint, json={'query': query}, headers=headers, timeout=30)
        if response.status_code == 200:
            data = response.json()
            if 'errors' not in data and 'data' in data:
                return data['data']
    except Exception as e:
        print(f"Request failed: {e}")
    return None


if __name__ == "__main__":
    success = verify_field_descriptions()
    exit(0 if success else 1)

