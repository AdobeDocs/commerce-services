#!/usr/bin/env python3
"""
Analyze the recommendations query in local documentation and identify
potential missing arguments based on typical e-commerce recommendation patterns.
"""

def analyze_recommendations_documentation():
    """Analyze current recommendations query documentation for completeness."""
    
    print("Recommendations Query Documentation Analysis")
    print("=" * 55)
    
    # Current arguments in local documentation
    current_local_args = {
        "cartSkus": "[String]",
        "category": "String", 
        "currentSku": "String"
    }
    
    # Typical arguments expected in e-commerce recommendation systems
    expected_args = {
        "cartSkus": "[String]",
        "category": "String",
        "currentSku": "String",
        "pageSize": "Int",
        "currentPage": "Int",
        "filter": "[RecommendationFilterInput!]",
        "userGroupId": "String",
        "searchTerm": "String",
        "excludeProductIds": "[String!]",
        "includeProductIds": "[String!]",
        "priceRange": "PriceRangeInput",
        "context": "RecommendationContextInput"
    }
    
    print("📋 CURRENT LOCAL ARGUMENTS:")
    for i, (name, type_def) in enumerate(current_local_args.items(), 1):
        print(f"   {i}. {name}: {type_def}")
    
    print(f"\n📋 POTENTIALLY EXPECTED ARGUMENTS:")
    for i, (name, type_def) in enumerate(expected_args.items(), 1):
        status = "✅ Present" if name in current_local_args else "❌ Missing"
        print(f"   {i}. {name}: {type_def} - {status}")
    
    # Identify missing arguments
    missing_args = set(expected_args.keys()) - set(current_local_args.keys())
    
    print(f"\n❌ POTENTIALLY MISSING ARGUMENTS ({len(missing_args)}):")
    if missing_args:
        for i, arg_name in enumerate(sorted(missing_args), 1):
            print(f"   {i}. {arg_name}: {expected_args[arg_name]}")
    else:
        print("   None - all expected arguments present")
    
    # Identify potential missing input types
    potential_missing_types = [
        "RecommendationFilterInput",
        "RecommendationContextInput", 
        "PriceRangeInput"
    ]
    
    print(f"\n🔍 POTENTIALLY MISSING INPUT TYPES:")
    for i, type_name in enumerate(potential_missing_types, 1):
        print(f"   {i}. {type_name}")
        print(f"      └─ Used by: {[arg for arg, type_def in expected_args.items() if type_name in type_def]}")
    
    return missing_args, potential_missing_types

def check_metadata_for_recommendations():
    """Check if recommendation-related types are marked as undocumented in metadata."""
    
    print("\n" + "=" * 55)
    print("METADATA INVESTIGATION")
    print("=" * 55)
    
    # Types that might be filtered out
    recommendation_related_types = [
        "RecommendationFilterInput",
        "RecommendationContextInput",
        "PriceRangeInput",
        "RecommendationSortInput",
        "RecommendationUnit",
        "Recommendations"
    ]
    
    print("\n🔍 RECOMMENDATION-RELATED TYPES TO CHECK:")
    for i, type_name in enumerate(recommendation_related_types, 1):
        print(f"   {i}. {type_name}")
    
    print("\n📋 ACTIONS NEEDED:")
    print("   1. Search metadata-merchandising.json for these types")
    print("   2. Ensure they are NOT marked as 'undocumented: true'")
    print("   3. Add missing types if they don't exist in metadata")
    print("   4. Regenerate documentation")
    
    return recommendation_related_types

def create_metadata_fix_script():
    """Create a script to fix metadata for recommendations types."""
    
    print("\n" + "=" * 55)
    print("METADATA FIX SCRIPT")
    print("=" * 55)
    
    script_content = '''
# Fix for recommendations query metadata
# Add these entries to metadata-merchandising.json if missing:

{
  "INPUT_OBJECT": {
    "RecommendationFilterInput": {
      "documentation": {
        "undocumented": false
      }
    },
    "RecommendationContextInput": {
      "documentation": {
        "undocumented": false
      }
    },
    "PriceRangeInput": {
      "documentation": {
        "undocumented": false
      }
    },
    "RecommendationSortInput": {
      "documentation": {
        "undocumented": false
      }
    }
  },
  "OBJECT": {
    "RecommendationUnit": {
      "documentation": {
        "undocumented": false
      }
    },
    "Recommendations": {
      "documentation": {
        "undocumented": false
      }
    }
  }
}
'''
    
    print("📝 METADATA ENTRIES TO ADD/MODIFY:")
    print(script_content)
    
    return script_content

def main():
    """Main execution function."""
    print("Recommendations Query Documentation Analysis")
    print("Comparing current local documentation with expected patterns")
    print()
    
    missing_args, missing_types = analyze_recommendations_documentation()
    recommendation_types = check_metadata_for_recommendations()
    metadata_fix = create_metadata_fix_script()
    
    print("\n" + "=" * 55)
    print("SUMMARY & NEXT STEPS")
    print("=" * 55)
    
    if missing_args or missing_types:
        print("❌ ISSUES IDENTIFIED:")
        print(f"   - {len(missing_args)} potentially missing arguments")
        print(f"   - {len(missing_types)} potentially missing input types")
        
        print("\n✅ RECOMMENDED ACTIONS:")
        print("   1. Check online documentation at:")
        print("      https://developer.adobe.com/commerce/services/reference/graphql/")
        print("   2. Compare with live GraphQL introspection")
        print("   3. Update metadata-merchandising.json for missing types")
        print("   4. Regenerate documentation")
        print("   5. Validate against live endpoint")
    else:
        print("✅ No obvious issues found in recommendations documentation")
    
    return 0 if not (missing_args or missing_types) else 1

if __name__ == "__main__":
    exit(main())

