export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error?.response) {
    return 'Network error. Please check your connection and confirm the backend API is running.'
  }

  const data = error.response.data
  if (!data) return fallback
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(' ')

  const fieldErrors = Object.entries(data)
    .flatMap(([field, value]) => {
      const message = Array.isArray(value) ? value.join(' ') : String(value)
      return `${field.replaceAll('_', ' ')}: ${message}`
    })

  return fieldErrors.length ? fieldErrors.join(' ') : fallback
}
