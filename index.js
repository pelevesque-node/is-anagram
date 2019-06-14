'use strict'

const canonicalizeString = require('@pelevesque/canonicalize-string')

function removeSubstrings (str, substrings) {
  substrings.forEach(substring => {
    str = str.replace(substring, '')
  })
  return str
}

function escapeRegexReservedChars (str) {
  // eslint-disable-next-line
  const match = /([\\\[\^\$\.\|\?\*\+\(\)])/
  const re = new RegExp(match, 'g')
  return str.replace(re, '\\$1')
}

module.exports = (str1, str2, o = {}) => {
  if (str1 === '' || str2 === '') return false

  if (typeof o.substringsToIgnore === 'undefined') o.substringsToIgnore = []
  if (typeof o.canonicalize === 'undefined') o.canonicalize = false
  if (typeof o.group === 'undefined') o.group = null

  o.substringsToIgnore.forEach(substring => {
    substring = escapeRegexReservedChars(substring)
    const re = new RegExp(substring, 'g')
    str1 = str1.replace(re, '')
    str2 = str2.replace(re, '')
  })

  if (o.canonicalize) {
    str1 = canonicalizeString(str1)
    str2 = canonicalizeString(str2)
  }

  if (str1.length !== str2.length) return false
  if (str1.localeCompare(str2) === 0) return true // same string

  let elements = []

  if (o.group === null) {
    elements = str1.split('')
  } else if (Array.isArray(o.group)) {
    elements = o.group
    elements.sort(function (a, b) { return b.length - a.length })
    str1 = removeSubstrings(str1, elements)
    if (str1 !== '') return false
  } else if (typeof o.group === 'number') {
    const re = new RegExp('.{1,' + o.group + '}', 'g')
    elements = str1.match(re)
  } else {
    return false
  }

  str2 = removeSubstrings(str2, elements)

  return str2 === ''
}
