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

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type EditionType {
      type: String
      tooltip: String
    }

    type MdxFrontmatter @dontInfer {
      edition: String
      editionObjects: [EditionType]
    }

    type MarkdownRemarkFrontmatter @dontInfer {
      edition: String
      editionObjects: [EditionType]
    }
  `);
};

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MdxFrontmatter: {
      edition: {
        resolve: source => {
          if (!source.edition) return null;
          
          // If it's a string, return it as is
          if (typeof source.edition === 'string') {
            return source.edition;
          }
          
          // If it's an array, return the first item's type
          if (Array.isArray(source.edition) && source.edition.length > 0) {
            return typeof source.edition[0] === 'object' 
              ? source.edition[0].type 
              : source.edition[0];
          }
          
          // If it's a single object, return its type
          if (typeof source.edition === 'object') {
            return source.edition.type;
          }
          
          return null;
        },
      },
      editionObjects: {
        resolve: source => {
          if (!source.edition) return null;
          
          // If it's a string, convert it to the expected format
          if (typeof source.edition === 'string') {
            return [{ type: source.edition }];
          }
          
          // If it's already an array, return it as is
          if (Array.isArray(source.edition)) {
            return source.edition;
          }
          
          // If it's a single object, wrap it in an array
          if (typeof source.edition === 'object') {
            return [source.edition];
          }
          
          return null;
        },
      },
    },
    MarkdownRemark: {
      frontmatter: {
        edition: {
          resolve: source => {
            if (!source.edition) return null;
            
            // If it's a string, return it as is
            if (typeof source.edition === 'string') {
              return source.edition;
            }
            
            // If it's an array, return the first item's type
            if (Array.isArray(source.edition) && source.edition.length > 0) {
              return typeof source.edition[0] === 'object' 
                ? source.edition[0].type 
                : source.edition[0];
            }
            
            // If it's a single object, return its type
            if (typeof source.edition === 'object') {
              return source.edition.type;
            }
            
            return null;
          },
        },
        editionObjects: {
          resolve: source => {
            if (!source.edition) return null;
            
            // If it's a string, convert it to the expected format
            if (typeof source.edition === 'string') {
              return [{ type: source.edition }];
            }
            
            // If it's already an array, return it as is
            if (Array.isArray(source.edition)) {
              return source.edition;
            }
            
            // If it's a single object, wrap it in an array
            if (typeof source.edition === 'object') {
              return [source.edition];
            }
            
            return null;
          },
        },
      },
    },
  };
  createResolvers(resolvers);
}; 