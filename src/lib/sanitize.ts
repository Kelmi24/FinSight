import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes user input to prevent XSS attacks
 * Uses DOMPurify to strip potentially malicious HTML/JS
 * 
 * @param dirty - Unsanitized user input string
 * @returns Sanitized string safe for rendering
 * 
 * @example
 * const cleanDescription = sanitizeInput(formData.get("description"))
 * const cleanNote = sanitizeInput(userComment)
 */
export function sanitizeInput(dirty: string | null | undefined): string {
  if (!dirty) return ''
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [], // Strip all attributes
    KEEP_CONTENT: true, // Keep text content
  })
}

/**
 * Sanitizes HTML input allowing basic formatting tags
 * Useful for rich text fields like notes or descriptions
 * 
 * @param dirty - Unsanitized HTML string
 * @returns Sanitized HTML safe for rendering
 * 
 * @example
 * const cleanNote = sanitizeHTML(formData.get("note"))
 */
export function sanitizeHTML(dirty: string | null | undefined): string {
  if (!dirty) return ''
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  })
}

/**
 * Validates and sanitizes numeric input
 * Ensures value is a valid number within acceptable range
 * 
 * @param value - Input value to validate
 * @param options - Validation options (min, max, decimals)
 * @returns Sanitized number or null if invalid
 * 
 * @example
 * const amount = sanitizeNumber(formData.get("amount"), { min: 0, decimals: 2 })
 */
export function sanitizeNumber(
  value: string | number | null | undefined,
  options: {
    min?: number
    max?: number
    decimals?: number
  } = {}
): number | null {
  if (value === null || value === undefined || value === '') return null
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  // Check if valid number
  if (isNaN(num) || !isFinite(num)) return null
  
  // Apply min/max constraints
  if (options.min !== undefined && num < options.min) return null
  if (options.max !== undefined && num > options.max) return null
  
  // Round to specified decimals
  if (options.decimals !== undefined) {
    return Math.round(num * Math.pow(10, options.decimals)) / Math.pow(10, options.decimals)
  }
  
  return num
}
