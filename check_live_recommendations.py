#!/usr/bin/env python3
"""
Check the live GraphQL endpoint to see what arguments the recommendations query actually has.
"""

import requests
import json

def check_live_recommendations_query():
    """Query the live endpoint to get actual recommendations query definition."""
    
    endpoint = "https://na1-sandbox.api.commerce.adobe.com/Fwus6kdpvYCmeEdcCX7PZg/graphql"
    headers = {
        'Content-Type': 'application/json',
        'Magento-Website-Code': 'default',
        'Magento-Store-Code': 'default', 
        'Magento-Store-View-Code': 'default'
    }
    
    # Targeted introspection for recommendations and recommendationsByUnitIds
    introspection_query = """
    query GetRecommendationsFields {
      __schema {
        queryType {
          fields {
            name
            description
            args {
              name
              description
              type {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                  }
                }
              }
              defaultValue
            }
          }
        }
      }
    }
    """
    
    print("Live GraphQL Schema Check - Recommendations Query")
    print("=" * 55)
    print(f"Endpoint: {endpoint}")
    print()
    
    try:
        response = requests.post(endpoint, json={'query': introspection_query}, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if 'errors' in data:
            print("❌ GraphQL errors:")
            for error in data['errors']:
                print(f"   - {error.get('message')}")
            return False
            
        # Find recommendations queries
        query_fields = data['data']['__schema']['queryType']['fields']
        
        recommendations_fields = [field for field in query_fields 
                                 if field['name'] in ['recommendations', 'recommendationsByUnitIds']]
        
        for field in recommendations_fields:
            print(f"🔍 LIVE QUERY: {field['name']}")
            print(f"   Description: {field.get('description', 'No description')}")
            print(f"   Arguments ({len(field['args'])}):")
            
            for i, arg in enumerate(field['args'], 1):
                arg_type = format_type(arg['type'])
                description = arg.get('description', 'No description')
                default_val = arg.get('defaultValue')
                default_str = f" (default: {default_val})" if default_val else ""
                print(f"      {i}. {arg['name']}: {arg_type}{default_str}")
                print(f"         └─ {description}")
            print()
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ HTTP Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def format_type(type_info):
    """Format GraphQL type information into readable string."""
    if not type_info:
        return "Unknown"
    
    kind = type_info.get('kind')
    name = type_info.get('name')
    
    if kind == 'NON_NULL':
        inner_type = format_type(type_info.get('ofType'))
        return f"{inner_type}!"
    elif kind == 'LIST':
        inner_type = format_type(type_info.get('ofType'))
        return f"[{inner_type}]"
    elif name:
        return name
    else:
        return "Unknown"

def compare_with_local():
    """Compare findings with local documentation."""
    
    print("=" * 55)
    print("COMPARISON WITH LOCAL DOCUMENTATION")
    print("=" * 55)
    
    local_recommendations_args = [
        "cartSkus: [String]",
        "category: String", 
        "currentSku: String"
    ]
    
    local_recommendations_by_unit_ids_args = [
        "unitIds: [String!]!",
        "currentSku: String",
        "cartSkus: [String]"
    ]
    
    print("📋 LOCAL RECOMMENDATIONS ARGUMENTS:")
    for i, arg in enumerate(local_recommendations_args, 1):
        print(f"   {i}. {arg}")
    
    print(f"\n📋 LOCAL RECOMMENDATIONS_BY_UNIT_IDS ARGUMENTS:")
    for i, arg in enumerate(local_recommendations_by_unit_ids_args, 1):
        print(f"   {i}. {arg}")
    
    print(f"\n💡 RECOMMENDATION:")
    print("   Compare the live results above with these local arguments")
    print("   to identify any discrepancies that need to be addressed")
    print("   in the metadata-merchandising.json file.")

def main():
    """Main execution function."""
    print("Checking Live GraphQL Schema for Recommendations Query")
    print()
    
    success = check_live_recommendations_query()
    
    if success:
        compare_with_local()
        
        print(f"\n📝 NEXT STEPS:")
        print("   1. Identify missing arguments from live schema")
        print("   2. Find corresponding input types that need to be documented")
        print("   3. Update metadata-merchandising.json accordingly")
        print("   4. Regenerate documentation")
    else:
        print("❌ Unable to retrieve live schema information")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())














