#!/usr/bin/env python3
"""
Compare productSearch query documentation between local filtered version 
and online unfiltered version to identify filtering issues.
"""

def compare_productSearch_documentation():
    """Compare the two versions of productSearch documentation."""
    
    print("ProductSearch Query Documentation Comparison")
    print("=" * 60)
    print()
    
    # Based on the online documentation from the websearch result
    online_args = [
        "context: QueryContextInput",
        "current_page: Int", 
        "filter: [ProductSearchFilterInput!]",
        "page_size: Int",
        "phrase: String!",
        "sort: [ProductSearchSortInput!]"
    ]
    
    # Based on local filtered documentation
    local_args = [
        "current_page: Int",
        "page_size: Int", 
        "phrase: String!"
    ]
    
    print("📋 ONLINE (Unfiltered) ProductSearch Arguments:")
    for i, arg in enumerate(online_args, 1):
        print(f"   {i}. {arg}")
    
    print(f"\n📋 LOCAL (Filtered) ProductSearch Arguments:")
    for i, arg in enumerate(local_args, 1):
        print(f"   {i}. {arg}")
    
    print("\n" + "=" * 60)
    print("ANALYSIS")
    print("=" * 60)
    
    # Find missing arguments
    online_set = set(online_args)
    local_set = set(local_args)
    missing_args = online_set - local_set
    
    print(f"\n❌ MISSING ARGUMENTS IN LOCAL VERSION ({len(missing_args)}):")
    if missing_args:
        for i, arg in enumerate(sorted(missing_args), 1):
            print(f"   {i}. {arg}")
    else:
        print("   None")
    
    print(f"\n✅ PRESENT IN BOTH VERSIONS ({len(local_set & online_set)}):")
    common_args = local_set & online_set
    if common_args:
        for i, arg in enumerate(sorted(common_args), 1):
            print(f"   {i}. {arg}")
    else:
        print("   None")
    
    # Analyze the problem
    print("\n" + "=" * 60)
    print("ROOT CAUSE ANALYSIS")
    print("=" * 60)
    
    print("\n🔍 FILTERING ISSUE IDENTIFIED:")
    print("   The metadata-merchandising.json file is aggressively filtering")
    print("   out most GraphQL types and input objects as 'undocumented: true'")
    print()
    
    missing_types = [
        "QueryContextInput",
        "ProductSearchFilterInput", 
        "ProductSearchSortInput"
    ]
    
    print("📝 FILTERED OUT TYPES:")
    for i, type_name in enumerate(missing_types, 1):
        print(f"   {i}. {type_name} - marked as undocumented")
    
    print("\n🎯 IMPACT:")
    print("   • Reduces productSearch from 6 arguments to 3 arguments")
    print("   • Removes advanced filtering capabilities (filter argument)")
    print("   • Removes sorting capabilities (sort argument)")  
    print("   • Removes query context features (context argument)")
    print("   • Documentation becomes incomplete and misleading")
    
    print("\n🔧 SOLUTION:")
    print("   1. Review metadata-merchandising.json filtering rules")
    print("   2. Remove 'undocumented: true' for productSearch-related types:")
    for type_name in missing_types:
        print(f"      - {type_name}")
    print("   3. Regenerate documentation to include all arguments")
    print("   4. Compare with live GraphQL introspection to verify completeness")
    
    # Show exact metadata changes needed
    print("\n📋 REQUIRED METADATA CHANGES:")
    print("   In metadata-merchandising.json, change these entries:")
    print("   ```json")
    print('   "QueryContextInput": {')
    print('     "documentation": {')
    print('       "undocumented": false  // <-- Change from true to false')
    print('     }')
    print('   },')
    print('   "ProductSearchFilterInput": {')
    print('     "documentation": {')
    print('       "undocumented": false  // <-- Add this entry if missing')
    print('     }')
    print('   },')
    print('   "ProductSearchSortInput": {')
    print('     "documentation": {')
    print('       "undocumented": false  // <-- Add this entry if missing')
    print('     }')
    print('   }')
    print("   ```")
    
    return len(missing_args) > 0


def main():
    """Main execution function."""
    print("GraphQL Documentation Filtering Investigation")
    print("Comparing local filtered vs online unfiltered productSearch query")
    print()
    
    has_discrepancies = compare_productSearch_documentation()
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    if has_discrepancies:
        print("❌ DISCREPANCY CONFIRMED:")
        print("   Local filtered documentation is missing critical productSearch arguments")
        print("   due to aggressive filtering in metadata-merchandising.json")
        print()
        print("✅ NEXT STEPS:")
        print("   1. Update metadata-merchandising.json filtering rules")
        print("   2. Regenerate documentation")
        print("   3. Validate against live GraphQL endpoint")
    else:
        print("✅ No discrepancies found between versions")
    
    return 0 if not has_discrepancies else 1


if __name__ == "__main__":
    exit(main())

