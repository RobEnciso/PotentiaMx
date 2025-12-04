/**
 * HTML Sanitization Utilities
 *
 * SECURITY: These functions protect against Stored XSS attacks by sanitizing
 * user-generated content before rendering it in the DOM.
 *
 * Uses DOMPurify (isomorphic-dompurify) which works in both browser and Node.js.
 *
 * @see https://github.com/cure53/DOMPurify
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML by removing ALL tags and keeping only text content.
 *
 * Use this for: user names, titles, labels, and any content that should be plain text.
 *
 * Example:
 * Input:  '<script>alert("XSS")</script>Hello'
 * Output: 'Hello'
 *
 * @param {string} dirty - User-generated content that may contain malicious HTML
 * @returns {string} - Safe plain text with all HTML tags removed
 */
export function sanitizeHTML(dirty) {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [], // Remove all attributes
    KEEP_CONTENT: true, // Keep the text content inside tags
  });
}

/**
 * Sanitizes content for safe use in HTML attributes.
 *
 * Use this for: title attributes, aria-label, data-* attributes.
 *
 * Example:
 * Input:  'Hotspot" onclick="alert(1)"'
 * Output: 'Hotspot&quot; onclick=&quot;alert(1)&quot;'
 *
 * @param {string} dirty - User-generated content for use in attributes
 * @returns {string} - Safe string with HTML entities escaped
 */
export function sanitizeAttribute(dirty) {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // First pass: Remove all HTML tags
  const textOnly = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });

  // Second pass: Escape HTML entities for safe use in attributes
  return textOnly
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes HTML allowing basic formatting tags only.
 *
 * Use this for: rich text content, descriptions, info modals where basic formatting is needed.
 *
 * Allowed tags: b, i, em, strong, p, br, ul, ol, li
 *
 * Example:
 * Input:  '<p>Safe <b>text</b></p><script>alert("XSS")</script>'
 * Output: '<p>Safe <b>text</b></p>'
 *
 * @param {string} dirty - User-generated rich text content
 * @returns {string} - Safe HTML with only basic formatting tags
 */
export function sanitizeRichText(dirty) {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [], // No attributes allowed (removes onclick, onerror, etc.)
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitizes URLs to prevent javascript: and data: URI XSS attacks.
 *
 * Use this for: user-provided image URLs, links, iframe sources.
 *
 * @param {string} url - User-provided URL
 * @returns {string} - Safe URL or empty string if malicious
 */
export function sanitizeURL(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove whitespace
  const trimmed = url.trim();

  // Block dangerous protocols
  const dangerous = /^(javascript|data|vbscript|file|about):/i;
  if (dangerous.test(trimmed)) {
    console.warn('[SECURITY] Blocked dangerous URL:', trimmed);
    return '';
  }

  // Allow only http, https, or relative URLs
  const safe = /^(https?:\/\/|\/)/i;
  if (!safe.test(trimmed)) {
    console.warn('[SECURITY] Blocked non-http URL:', trimmed);
    return '';
  }

  return trimmed;
}

/**
 * Sanitizes an array of URLs (for image galleries, panoramas, etc.)
 *
 * @param {string[]} urls - Array of user-provided URLs
 * @returns {string[]} - Array of safe URLs with malicious ones filtered out
 */
export function sanitizeURLArray(urls) {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls
    .map(url => sanitizeURL(url))
    .filter(url => url !== ''); // Remove empty strings (blocked URLs)
}
