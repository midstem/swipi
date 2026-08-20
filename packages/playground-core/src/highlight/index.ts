import { CodeLanguage, CodeToken, CodeTokenKind } from '../types'

const KEYWORDS = new Set([
  'as',
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'constructor',
  'continue',
  'declare',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'from',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'null',
  'of',
  'private',
  'protected',
  'public',
  'readonly',
  'return',
  'satisfies',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'type',
  'typeof',
  'undefined',
  'var',
  'void',
  'while',
  'yield'
])

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
])

const BLOCK_KEYWORDS = new Set([
  'case',
  'default',
  'defer',
  'else',
  'empty',
  'error',
  'for',
  'if',
  'let',
  'loading',
  'placeholder',
  'switch'
])

const SCRIPT_TAG = 'script'

const STYLE_TAG = 'style'

const EMPTY = ''

const NOT_FOUND = -1

const NO_DEPTH = 0

const ONE_CHAR = 1

const TWO_CHARS = 2

const WHITESPACE = /\s+/y

const LINE_COMMENT = /\/\/[^\n]*/y

const BLOCK_COMMENT = /\/\*[\s\S]*?(?:\*\/|$)/y

const HTML_COMMENT = /<!--[\s\S]*?(?:-->|$)/y

const QUOTED = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/y

const IDENTIFIER = /[A-Za-z_$][\w$]*/y

const NUMBER = /\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?/iy

const TAG_NAME = /[A-Za-z][\w.:-]*/y

const ATTRIBUTE_NAME = /[@:#*[(]?[A-Za-z_][\w.:-]*[)\]]?/y

const UNQUOTED_VALUE = /[^\s>]+/y

const MARKUP_TEXT = /[^<{}@`]+/y

const BLOCK_NAME = /@([a-z]+)/y

const TEMPLATE_MARKUP = /\s*<[A-Za-z]/y

const CSS_NUMBER = /\d*\.?\d+(?:px|ms|s|%|deg|em|rem|vw|vh|fr|ch)?/y

const CSS_WORD = /[\w.#&>~+*-]+/y

const CSS_AT_RULE = /@[\w-]+/y

const AFTER_VALUE = /[\w$)\]'"`]/

const JSX_AFTER_ANGLE = /[A-Za-z>/]/

const TAG_AFTER_ANGLE = /[A-Za-z>]/

type Cursor = {
  source: string
  pos: number
  last: string
  tokens: CodeToken[]
}

type MarkupOptions = {
  stopAtBacktick?: boolean
  stopAtBrace?: boolean
}

type CodeStop = 'none' | 'brace' | 'paren'

const createCursor = (source: string, tokens: CodeToken[] = []): Cursor => ({
  source,
  pos: 0,
  last: EMPTY,
  tokens
})

const push = (cursor: Cursor, text: string, kind: CodeTokenKind): void => {
  if (!text) return

  const trimmed = text.trimEnd()
  const previous = cursor.tokens.at(-1)

  if (trimmed) cursor.last = trimmed.slice(-ONE_CHAR)

  if (previous?.kind === kind) {
    previous.text += text

    return
  }

  cursor.tokens.push({ text, kind })
}

const peek = (cursor: Cursor, offset = 0): string =>
  cursor.source[cursor.pos + offset] ?? EMPTY

const starts = (cursor: Cursor, text: string): boolean =>
  cursor.source.startsWith(text, cursor.pos)

const isDone = (cursor: Cursor): boolean => cursor.pos >= cursor.source.length

const take = (cursor: Cursor, length: number): string => {
  const text = cursor.source.slice(cursor.pos, cursor.pos + length)

  cursor.pos += text.length

  return text
}

const read = (cursor: Cursor, pattern: RegExp): string => {
  pattern.lastIndex = cursor.pos

  const found = pattern.exec(cursor.source)

  if (!found) return EMPTY

  cursor.pos += found[0].length

  return found[0]
}

const looksLike = (cursor: Cursor, pattern: RegExp): boolean => {
  pattern.lastIndex = cursor.pos

  return pattern.test(cursor.source)
}

const isJsxStart = (cursor: Cursor): boolean =>
  JSX_AFTER_ANGLE.test(peek(cursor, ONE_CHAR)) && !AFTER_VALUE.test(cursor.last)

const getIdentifierKind = (cursor: Cursor, name: string): CodeTokenKind => {
  if (KEYWORDS.has(name)) return 'keyword'

  return peek(cursor) === '(' ? 'function' : 'plain'
}

const readCode = (cursor: Cursor, stop: CodeStop = 'none'): void => {
  let braces = NO_DEPTH
  let parens = NO_DEPTH

  while (!isDone(cursor)) {
    const char = peek(cursor)

    if (char === '}') {
      if (braces === NO_DEPTH && stop === 'brace') return

      braces -= ONE_CHAR
      push(cursor, take(cursor, ONE_CHAR), 'punctuation')
      continue
    }

    if (char === ')') {
      if (parens === NO_DEPTH && stop === 'paren') return

      parens -= ONE_CHAR
      push(cursor, take(cursor, ONE_CHAR), 'punctuation')
      continue
    }

    if (char === '{' || char === '(') {
      if (char === '{') braces += ONE_CHAR
      else parens += ONE_CHAR

      push(cursor, take(cursor, ONE_CHAR), 'punctuation')
      continue
    }

    const spaces = read(cursor, WHITESPACE)

    if (spaces) {
      push(cursor, spaces, 'plain')
      continue
    }

    if (starts(cursor, '//')) {
      push(cursor, read(cursor, LINE_COMMENT), 'comment')
      continue
    }

    if (starts(cursor, '/*')) {
      push(cursor, read(cursor, BLOCK_COMMENT), 'comment')
      continue
    }

    const quoted = read(cursor, QUOTED)

    if (quoted) {
      push(cursor, quoted, 'string')
      continue
    }

    if (char === '`') {
      readTemplate(cursor)
      continue
    }

    if (char === '<' && isJsxStart(cursor)) {
      readElement(cursor, {})
      continue
    }

    const number = read(cursor, NUMBER)

    if (number) {
      push(cursor, number, 'number')
      continue
    }

    const identifier = read(cursor, IDENTIFIER)

    if (identifier) {
      push(cursor, identifier, getIdentifierKind(cursor, identifier))
      continue
    }

    push(cursor, take(cursor, ONE_CHAR), 'punctuation')
  }
}

const readTemplate = (cursor: Cursor): void => {
  push(cursor, take(cursor, ONE_CHAR), 'string')

  if (looksLike(cursor, TEMPLATE_MARKUP)) {
    readMarkup(cursor, { stopAtBacktick: true })

    if (peek(cursor) === '`') push(cursor, take(cursor, ONE_CHAR), 'string')

    return
  }

  let text = EMPTY

  while (!isDone(cursor)) {
    const char = peek(cursor)

    if (char === '\\') {
      text += take(cursor, TWO_CHARS)
      continue
    }

    if (char === '`') {
      text += take(cursor, ONE_CHAR)
      break
    }

    if (char === '$' && peek(cursor, ONE_CHAR) === '{') {
      push(cursor, text, 'string')
      push(cursor, take(cursor, TWO_CHARS), 'punctuation')

      text = EMPTY

      readCode(cursor, 'brace')

      if (peek(cursor) === '}') {
        push(cursor, take(cursor, ONE_CHAR), 'punctuation')
      }

      continue
    }

    text += take(cursor, ONE_CHAR)
  }

  push(cursor, text, 'string')
}

const readExpression = (cursor: Cursor): void => {
  push(cursor, take(cursor, ONE_CHAR), 'punctuation')

  readCode(cursor, 'brace')

  if (peek(cursor) === '}') push(cursor, take(cursor, ONE_CHAR), 'punctuation')
}

const readBlock = (cursor: Cursor, options: MarkupOptions): boolean => {
  BLOCK_NAME.lastIndex = cursor.pos

  const found = BLOCK_NAME.exec(cursor.source)

  if (!found || !BLOCK_KEYWORDS.has(found[1])) return false

  cursor.pos += found[0].length

  push(cursor, found[0], 'keyword')
  push(cursor, read(cursor, WHITESPACE), 'plain')

  if (peek(cursor) === '(') {
    push(cursor, take(cursor, ONE_CHAR), 'punctuation')

    readCode(cursor, 'paren')

    if (peek(cursor) === ')') {
      push(cursor, take(cursor, ONE_CHAR), 'punctuation')
    }
  }

  push(cursor, read(cursor, WHITESPACE), 'plain')

  if (peek(cursor) !== '{') return true

  push(cursor, take(cursor, ONE_CHAR), 'punctuation')

  readMarkup(cursor, { ...options, stopAtBrace: true })

  if (peek(cursor) === '}') push(cursor, take(cursor, ONE_CHAR), 'punctuation')

  return true
}

const readClosingTag = (cursor: Cursor): void => {
  if (!starts(cursor, '</')) return

  push(cursor, take(cursor, TWO_CHARS), 'punctuation')
  push(cursor, read(cursor, TAG_NAME), 'tag')
  push(cursor, read(cursor, WHITESPACE), 'plain')

  if (peek(cursor) === '>') push(cursor, take(cursor, ONE_CHAR), 'punctuation')
}

const readAttributes = (cursor: Cursor): boolean => {
  while (!isDone(cursor)) {
    push(cursor, read(cursor, WHITESPACE), 'plain')

    if (starts(cursor, '/>')) {
      push(cursor, take(cursor, TWO_CHARS), 'punctuation')

      return true
    }

    if (peek(cursor) === '>') {
      push(cursor, take(cursor, ONE_CHAR), 'punctuation')

      return false
    }

    if (peek(cursor) === '{') {
      readExpression(cursor)
      continue
    }

    const name = read(cursor, ATTRIBUTE_NAME)

    if (!name) {
      push(cursor, take(cursor, ONE_CHAR), 'plain')
      continue
    }

    push(cursor, name, 'attribute')

    if (peek(cursor) !== '=') continue

    push(cursor, take(cursor, ONE_CHAR), 'punctuation')

    if (peek(cursor) === '{') {
      readExpression(cursor)
      continue
    }

    const quoted = read(cursor, QUOTED)

    push(cursor, quoted || read(cursor, UNQUOTED_VALUE), 'string')
  }

  return false
}

const readRaw = (
  cursor: Cursor,
  name: string,
  reader: (inner: Cursor) => void
): void => {
  const found = cursor.source.toLowerCase().indexOf(`</${name}`, cursor.pos)
  const stop = found === NOT_FOUND ? cursor.source.length : found
  const inner = createCursor(
    cursor.source.slice(cursor.pos, stop),
    cursor.tokens
  )

  reader(inner)

  cursor.pos = stop
  cursor.last = inner.last

  readClosingTag(cursor)
}

const readElement = (cursor: Cursor, options: MarkupOptions): void => {
  push(cursor, take(cursor, ONE_CHAR), 'punctuation')

  const name = read(cursor, TAG_NAME)

  push(cursor, name, 'tag')

  const selfClosing = readAttributes(cursor)
  const tag = name.toLowerCase()

  if (selfClosing || VOID_TAGS.has(tag)) return

  if (tag === SCRIPT_TAG) {
    readRaw(cursor, SCRIPT_TAG, (inner) => readCode(inner))

    return
  }

  if (tag === STYLE_TAG) {
    readRaw(cursor, STYLE_TAG, readCss)

    return
  }

  readMarkup(cursor, options)
  readClosingTag(cursor)
}

const readMarkup = (cursor: Cursor, options: MarkupOptions = {}): void => {
  while (!isDone(cursor)) {
    const char = peek(cursor)

    if (char === '`' && options.stopAtBacktick) return

    if (char === '}' && options.stopAtBrace) return

    if (char === '<') {
      if (peek(cursor, ONE_CHAR) === '/') return

      if (starts(cursor, '<!--')) {
        push(cursor, read(cursor, HTML_COMMENT), 'comment')
        continue
      }

      if (TAG_AFTER_ANGLE.test(peek(cursor, ONE_CHAR))) {
        readElement(cursor, options)
        continue
      }

      push(cursor, take(cursor, ONE_CHAR), 'plain')
      continue
    }

    if (char === '@' && readBlock(cursor, options)) continue

    if (char === '{') {
      readExpression(cursor)
      continue
    }

    const text = read(cursor, MARKUP_TEXT)

    push(cursor, text || take(cursor, ONE_CHAR), 'plain')
  }
}

const getCssWordKind = (
  depth: number,
  expectProperty: boolean
): CodeTokenKind => {
  if (depth === NO_DEPTH) return 'selector'

  return expectProperty ? 'property' : 'plain'
}

const readCss = (cursor: Cursor): void => {
  let depth = NO_DEPTH
  let expectProperty = true

  while (!isDone(cursor)) {
    const char = peek(cursor)

    const spaces = read(cursor, WHITESPACE)

    if (spaces) {
      push(cursor, spaces, 'plain')
      continue
    }

    if (starts(cursor, '/*')) {
      push(cursor, read(cursor, BLOCK_COMMENT), 'comment')
      continue
    }

    if (char === '{' || char === '}' || char === ';') {
      if (char === '{') depth += ONE_CHAR
      if (char === '}') depth -= ONE_CHAR

      expectProperty = true

      push(cursor, take(cursor, ONE_CHAR), 'punctuation')
      continue
    }

    if (char === ':') {
      expectProperty = false

      push(cursor, take(cursor, ONE_CHAR), 'punctuation')
      continue
    }

    const quoted = read(cursor, QUOTED)

    if (quoted) {
      push(cursor, quoted, 'string')
      continue
    }

    if (char === '@') {
      push(cursor, read(cursor, CSS_AT_RULE), 'keyword')
      continue
    }

    const number = read(cursor, CSS_NUMBER)

    if (number) {
      push(cursor, number, 'number')
      continue
    }

    const word = read(cursor, CSS_WORD)

    if (word) {
      push(cursor, word, getCssWordKind(depth, expectProperty))
      continue
    }

    push(cursor, take(cursor, ONE_CHAR), 'punctuation')
  }
}

export const highlight = (
  code: string,
  language: CodeLanguage
): CodeToken[] => {
  const cursor = createCursor(code)

  if (language === 'css') readCss(cursor)
  else if (language === 'markup') readMarkup(cursor)
  else readCode(cursor)

  return cursor.tokens
}
