#!/usr/bin/env python3
"""
Investigate the recommendations query to identify missing arguments and types
by performing GraphQL introspection and comparing with current documentation.
"""

import requests
import json

def introspect_recommendations():
    """Query the GraphQL endpoint to get complete recommendations query definition."""
    
    endpoint = "https://na1-sandbox.api.commerce.adobe.com/Fwus6kdpvYCmeEdcCX7PZg/graphql"
    headers = {
        'Content-Type': 'application/json',
        'Magento-Website-Code': 'default',
        'Magento-Store-Code': 'default', 
        'Magento-Store-View-Code': 'default'
    }
    
    # Introspection query to get recommendations query details
    introspection_query = """
    query IntrospectRecommendations {
      __schema {
        queryType {
          fields {
            name
            args {
              name
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
              description
              defaultValue
            }
          }
        }
      }
    }
    """
    
    print("GraphQL Introspection - Recommendations Query Investigation")
    print("=" * 65)
    print(f"Endpoint: {endpoint}")
    print("Performing introspection to discover complete recommendations query definition...")
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
            
        # Extract recommendations query details
        schema = data['data']['__schema']
        query_fields = schema['queryType']['fields']
        
        recommendations_query = None
        recommendations_by_unit_ids_query = None
        
        for field in query_fields:
            if field['name'] == 'recommendations':
                recommendations_query = field
            elif field['name'] == 'recommendationsByUnitIds':
                recommendations_by_unit_ids_query = field
        
        print("🔍 INTROSPECTION RESULTS:")
        print("-" * 40)
        
        if recommendations_query:
            print(f"\n📋 RECOMMENDATIONS QUERY:")
            print(f"   Description: {recommendations_query.get('description', 'No description')}")
            print(f"   Arguments ({len(recommendations_query['args'])}):")
            
            for i, arg in enumerate(recommendations_query['args'], 1):
                arg_type = format_type(arg['type'])
                description = arg.get('description', 'No description')
                default_val = arg.get('defaultValue')
                default_str = f" (default: {default_val})" if default_val else ""
                print(f"      {i}. {arg['name']}: {arg_type}{default_str}")
                print(f"         └─ {description}")
        
        if recommendations_by_unit_ids_query:
            print(f"\n📋 RECOMMENDATIONS_BY_UNIT_IDS QUERY:")
            print(f"   Description: {recommendations_by_unit_ids_query.get('description', 'No description')}")
            print(f"   Arguments ({len(recommendations_by_unit_ids_query['args'])}):")
            
            for i, arg in enumerate(recommendations_by_unit_ids_query['args'], 1):
                arg_type = format_type(arg['type'])
                description = arg.get('description', 'No description')
                default_val = arg.get('defaultValue')
                default_str = f" (default: {default_val})" if default_val else ""
                print(f"      {i}. {arg['name']}: {arg_type}{default_str}")
                print(f"         └─ {description}")
        
        # Compare with current local documentation
        print("\n" + "=" * 65)
        print("COMPARISON WITH LOCAL DOCUMENTATION")
        print("=" * 65)
        
        current_recommendations_args = [
            "cartSkus: [String]",
            "category: String", 
            "currentSku: String"
        ]
        
        current_recommendations_by_unit_ids_args = [
            "unitIds: [String!]!",
            "currentSku: String",
            "cartSkus: [String]"
        ]
        
        print(f"\n📋 CURRENT LOCAL RECOMMENDATIONS ARGUMENTS ({len(current_recommendations_args)}):")
        for i, arg in enumerate(current_recommendations_args, 1):
            print(f"   {i}. {arg}")
        
        print(f"\n📋 CURRENT LOCAL RECOMMENDATIONS_BY_UNIT_IDS ARGUMENTS ({len(current_recommendations_by_unit_ids_args)}):")
        for i, arg in enumerate(current_recommendations_by_unit_ids_args, 1):
            print(f"   {i}. {arg}")
        
        # Analyze missing arguments
        if recommendations_query:
            live_rec_args = set(arg['name'] for arg in recommendations_query['args'])
            local_rec_args = set(arg.split(':')[0].strip() for arg in current_recommendations_args)
            missing_rec_args = live_rec_args - local_rec_args
            
            print(f"\n❌ MISSING RECOMMENDATIONS ARGUMENTS ({len(missing_rec_args)}):")
            if missing_rec_args:
                for i, arg_name in enumerate(sorted(missing_rec_args), 1):
                    # Find the full argument details
                    arg_details = next((arg for arg in recommendations_query['args'] if arg['name'] == arg_name), None)
                    if arg_details:
                        arg_type = format_type(arg_details['type'])
                        print(f"   {i}. {arg_name}: {arg_type}")
            else:
                print("   None - all arguments present")
        
        if recommendations_by_unit_ids_query:
            live_rec_by_id_args = set(arg['name'] for arg in recommendations_by_unit_ids_query['args'])
            local_rec_by_id_args = set(arg.split(':')[0].strip() for arg in current_recommendations_by_unit_ids_args)
            missing_rec_by_id_args = live_rec_by_id_args - local_rec_by_id_args
            
            print(f"\n❌ MISSING RECOMMENDATIONS_BY_UNIT_IDS ARGUMENTS ({len(missing_rec_by_id_args)}):")
            if missing_rec_by_id_args:
                for i, arg_name in enumerate(sorted(missing_rec_by_id_args), 1):
                    # Find the full argument details
                    arg_details = next((arg for arg in recommendations_by_unit_ids_query['args'] if arg['name'] == arg_name), None)
                    if arg_details:
                        arg_type = format_type(arg_details['type'])
                        print(f"   {i}. {arg_name}: {arg_type}")
            else:
                print("   None - all arguments present")
        
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

def main():
    """Main execution function."""
    print("Recommendations Query Investigation")
    print("Comparing live GraphQL schema with local filtered documentation")
    print()
    
    success = introspect_recommendations()
    
    print("\n" + "=" * 65)
    print("SUMMARY")
    print("=" * 65)
    
    if success:
        print("✅ Successfully introspected recommendations queries")
        print("\n🔧 NEXT STEPS:")
        print("   1. Identify missing input types in metadata-merchandising.json")
        print("   2. Set 'undocumented: false' for missing types")
        print("   3. Regenerate documentation")
        print("   4. Validate completeness")
    else:
        print("❌ Failed to introspect recommendations queries")
        print("   Check network connectivity and endpoint availability")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())

