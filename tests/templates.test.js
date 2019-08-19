const fs = require('fs')

const templates = JSON.parse(
  fs.readFileSync(__dirname + '/../lib/src/templates.json', 'utf8')
)

test('Has all planet templates', () => {
  const count = templates.pages.filter(page => page.classOf === 'planet').length

  expect(count).toBe(3)
})

test('Has all star templates', () => {
  const count = templates.pages.filter(page => page.classOf === 'star').length

  expect(count).toBe(4)
})

test('Has all galaxy templates', () => {
  const count = templates.pages.filter(page => page.classOf === 'galaxy').length

  expect(count).toBe(5)
})

test('Has multipass template', () => {
  const count = templates.pages.filter(page => page.classOf === 'all').length

  expect(count).toBe(1)
})
