#!/usr/bin/env python3
"""
Extract and test attributeMetadata query to retrieve filterable and sortable attributes.
"""

import json
import requests


def test_attributeMetadata():
    """Test attributeMetadata query with no headers as specified."""
    
    endpoint = "https://na1-sandbox.api.commerce.adobe.com/Fwus6kdpvYCmeEdcCX7PZg/graphql"
    
    # No headers required as specified
    headers = {
        'Content-Type': 'application/json'
    }
    
    print("AttributeMetadata Query Test")
    print("=" * 40)
    print(f"Endpoint: {endpoint}")
    print("Headers: None (as specified)")
    print()
    
    # Step 1: First discover the schema structure
    print("1. Discovering AttributeMetadata schema structure...")
    
    introspection_query = """
    query {
        __type(name: "AttributeMetadataResponse") {
            fields {
                name
                type {
                    name
                    kind
                    ofType {
                        name
                        kind
                        fields {
                            name
                            type {
                                name
                                kind
                            }
                        }
                    }
                }
            }
        }
    }
    """
    
    schema_result = make_request(endpoint, headers, introspection_query, "Schema introspection")
    
    if schema_result:
        print("   ✅ Schema discovered successfully")
        analyze_schema(schema_result)
    else:
        print("   ❌ Schema discovery failed")
    
    # Step 2: Test the documentation query (expected to fail due to fragments)
    print("\n2. Testing documentation query (from index.html)...")
    
    doc_query = """
    query attributeMetadata {
        attributeMetadata {
            filterableInSearch {
                ...FilterableInSearchAttributeFragment
            }
            sortable {
                ...SortableAttributeFragment
            }
        }
    }
    """
    
    doc_result = make_request(endpoint, headers, doc_query, "Documentation query")
    
    if not doc_result:
        print("   ❌ Documentation query failed (expected due to undefined fragments)")
    
    # Step 3: Construct and test a working query
    print("\n3. Testing working attributeMetadata query...")
    
    working_query = """
    query attributeMetadata {
        attributeMetadata {
            filterableInSearch {
                attribute
                buckets {
                    title
                }
            }
            sortable {
                attribute
            }
        }
    }
    """
    
    working_result = make_request(endpoint, headers, working_query, "Working query")
    
    if working_result:
        print("   ✅ Working query successful!")
        display_results(working_result)
        return working_result
    else:
        print("   ❌ Working query failed")
    
    # Step 4: Try minimal query to debug
    print("\n4. Testing minimal query for debugging...")
    
    minimal_query = """
    query {
        attributeMetadata {
            filterableInSearch {
                attribute
            }
        }
    }
    """
    
    minimal_result = make_request(endpoint, headers, minimal_query, "Minimal query")
    
    if minimal_result:
        print("   ✅ Minimal query works!")
        display_results(minimal_result)
        return minimal_result
    
    return None


def make_request(endpoint, headers, query, description):
    """Make a GraphQL request and return the data if successful."""
    try:
        payload = {'query': query}
        response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'errors' in data:
                print(f"   ❌ {description} - GraphQL errors:")
                for error in data['errors'][:2]:  # Show first 2 errors
                    print(f"      - {error.get('message', 'Unknown error')}")
                return None
            elif 'data' in data:
                return data['data']
            else:
                print(f"   ❌ {description} - Unexpected response format")
                return None
        else:
            print(f"   ❌ {description} - HTTP {response.status_code}")
            return None
            
    except Exception as e:
        print(f"   ❌ {description} - Request failed: {e}")
        return None


def analyze_schema(schema_data):
    """Analyze the discovered schema structure."""
    if '__type' in schema_data and schema_data['__type']:
        fields = schema_data['__type']['fields']
        print("   Available fields in AttributeMetadataResponse:")
        
        for field in fields:
            field_name = field['name']
            field_type = field['type']
            
            print(f"      - {field_name}")
            
            # If it's a list type with object items, show the object fields
            if (field_type['kind'] == 'LIST' and 
                field_type['ofType'] and 
                field_type['ofType']['kind'] == 'NON_NULL' and
                field_type['ofType']['ofType'] and
                field_type['ofType']['ofType']['fields']):
                
                item_fields = field_type['ofType']['ofType']['fields']
                print(f"        Item fields:")
                for item_field in item_fields:
                    print(f"          • {item_field['name']}: {item_field['type']['name'] or item_field['type']['kind']}")


def display_results(data):
    """Display the query results in a readable format."""
    if 'attributeMetadata' in data:
        attr_data = data['attributeMetadata']
        
        print("\n   📊 RESULTS:")
        
        if 'filterableInSearch' in attr_data:
            filterable = attr_data['filterableInSearch']
            print(f"      Filterable attributes: {len(filterable)} found")
            
            for i, attr in enumerate(filterable[:5]):  # Show first 5
                attr_name = attr.get('attribute', 'Unknown')
                bucket_count = len(attr.get('buckets', [])) if attr.get('buckets') else 0
                print(f"        {i+1}. {attr_name} ({bucket_count} buckets)")
            
            if len(filterable) > 5:
                print(f"        ... and {len(filterable) - 5} more")
        
        if 'sortable' in attr_data:
            sortable = attr_data['sortable']
            print(f"      Sortable attributes: {len(sortable)} found")
            
            for i, attr in enumerate(sortable[:5]):  # Show first 5
                attr_name = attr.get('attribute', 'Unknown')
                print(f"        {i+1}. {attr_name}")
            
            if len(sortable) > 5:
                print(f"        ... and {len(sortable) - 5} more")


def main():
    """Main execution function."""
    print("🎯 Goal: Retrieve all attributeMetadata values that are filterable in search and sortable")
    print()
    
    result = test_attributeMetadata()
    
    print("\n" + "=" * 40)
    print("SUMMARY")
    print("=" * 40)
    
    if result:
        print("✅ Successfully retrieved attributeMetadata!")
        print()
        print("📋 Key Findings:")
        print("   1. The GraphQL endpoint works without headers")
        print("   2. Documentation fragments are undefined but query structure is correct")
        print("   3. Actual field names discovered through introspection")
        print("   4. Both filterable and sortable attributes retrieved")
        
        print("\n🔧 Documentation Fix Needed:")
        print("   Replace fragment references with actual field names:")
        print("   - FilterableInSearchAttributeFragment → attribute, buckets { title }")
        print("   - SortableAttributeFragment → attribute")
    else:
        print("❌ Failed to retrieve attributeMetadata")
        print("   Additional debugging may be required")
    
    return result is not None


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)

