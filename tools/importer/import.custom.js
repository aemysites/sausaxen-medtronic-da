
/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * A map of custom parser names to imported parser functions.
 *
 * eg.
 * {
 *   myParser: customParser1,
 * }
 */
export const customParsers = {};

/**
 * An array of custom page elements to parse.
 * The name is the parser name.
 * If the element is a string, it will be used as a selector to the element to parse.
 * If the element is not provided, the parser will be applied to the main element.
 *
 * eg.
 * [
 *   { name: 'myParser', element: 'selector' },
 * ]
 */
export const customElements = [];

/**
 * Custom transformers
 */
export const customTransformers = {
  /**
   * Removes unwanted navigation and header elements from the page
   * @param {Document} document - The document to transform
   */
  inject: (hookName, element, context) => {
    if (hookName === 'beforeTransform') {
      try {
        // Try to get document from context, element, or global
        const doc = context?.document || element?.ownerDocument || element?.document || document;
        
        if (doc) {
          // Check and remove .header
          let element1 = doc.querySelector(".header");
          console.log('Before removal - .header found:', !!element1);
          element1?.remove();
          console.log('After removal - .header still exists:', !!doc.querySelector(".header"));
          
          // Check and remove .footer
          let element2 = doc.querySelector(".footer");
          console.log('Before removal - .footer found:', !!element2);
          element2?.remove();
          console.log('After removal - .footer still exists:', !!doc.querySelector(".footer"));
          
          // Check and remove .ot-floating-button__front
          let element3 = doc.querySelector(".addthis_outer");
          console.log('Before removal - .addthis_outer found:', !!element3);
          element3?.remove();
          console.log('After removal - .addthis_outer still exists:', !!doc.querySelector(".addthis_outer"));

          let element4 = doc.querySelector(".ot-sdk-container");
          console.log('Before removal - .ot-sdk-container found:', !!element3);
          element4?.remove();
          console.log('After removal - .ot-sdk-container still exists:', !!doc.querySelector(".ot-sdk-container"));
          
           console.log('All element removals completed');
        } else {
          console.log('Debug: document is null, context:', context, 'element:', element);
        }
      } catch (e) {
        console.log('Error in removeUnwantedElements:', e);
      }
    }
  },
};
