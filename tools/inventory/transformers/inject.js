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
/* eslint-disable no-console */
(() => {
  try {
    // Remove standard elements
    document.querySelector('.header')?.remove();
    document.querySelector('.footer')?.remove();
    document.querySelector(".addthis_outer")?.remove();
    document.querySelector(".ot-sdk-container")?.remove();
    document.querySelector(".modal-dialog")?.remove();
    document.querySelector("#outdated")?.remove();
    document.querySelector("#modalAcknowledge")?.remove();
    
    // Enhanced pagination removal with multiple approaches
    const removePagination = () => {
      const pagination = document.querySelector("#fsvs-pagination");
      if (pagination) {
        pagination.remove();
        console.log('Pagination element removed');
        return true;
      }
      return false;
    };
    
    // Try immediate removal
    removePagination();
    
    // Set up observer for dynamically added pagination
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.id === 'fsvs-pagination' || (node.querySelector && node.querySelector('#fsvs-pagination'))) {
                console.log('Pagination detected via mutation observer, removing...');
                removePagination();
              }
            }
          });
        });
      });
      
      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });
      
      // Disconnect observer after 5 seconds
      setTimeout(() => observer.disconnect(), 5000);
    }
    
    // Delayed removal attempts
    [100, 500, 1000, 2000].forEach(delay => {
      setTimeout(() => {
        if (document.querySelector("#fsvs-pagination")) {
          console.log(`Delayed pagination removal attempt after ${delay}ms`);
          removePagination();
        }
      }, delay);
    });
    
  } catch (e) {
    console.log('Error in inject.js:', e);
  }
})();
