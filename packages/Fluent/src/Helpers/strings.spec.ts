import { Strings } from './Strings'

it('Should get the singular of a word', () => {
  const plural = 'dogs'
  const singular = Strings().singular(plural)
  expect(singular).toBe('dog')
})

it('Should get the plural of a word', () => {
  const singular = 'child'
  const plural = Strings().plural(singular)
  expect(plural).toBe('children')
})

it('Should get the singular given the count', () => {
  const singular = 'child'
  const plural = Strings().plural(singular, 1)
  expect(plural).toBe('child')
})

it('Should all text after a given string', () => {
  const after = Strings().after('This is my name', 'This is')
  expect(after).toBe(' my name')
})

it('Should all text before a given string', () => {
  const after = Strings().before('This is my name', 'my name')
  expect(after).toBe('This is ')
})

it('Should get the camelCase of a string', () => {
  const camel = Strings().camel('foo_bar')
  expect(camel).toBe('fooBar')
})

it('Should get if contains a string', () => {
  const contains = Strings().contains('This is my name', 'my')
  expect(contains).toBe(true)
})

it('Should get if contains any from string array', () => {
  const contains = Strings().contains('This is my name', ['myasdf', '1234'])
  expect(contains).toBe(false)

  const containsTrue = Strings().contains('This is my name', ['myasdf', 'my'])
  expect(containsTrue).toBe(true)
})

it('Should limit a given string', () => {
  const limit = Strings().limit('The quick brown fox jumps over the lazy dog', 20, ' (...)')
  expect(limit).toBe('The quick brown fox (...)')
})

it('Should generate a slug from a string', () => {
  const slug = Strings().slug('Laravel 5 Framework', '-')
  expect(slug).toBe('laravel-5-framework')
})

it('Should generate a snake_case string', () => {
  const snake = Strings().snake('fooBar')
  expect(snake).toBe('foo_bar')
})
