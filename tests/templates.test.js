const fs = require('fs')
const flat = require('flat')

const templates = JSON.parse(
  fs.readFileSync(__dirname + '/../lib/src/templates.json', 'utf8')
)

test('Has all planet templates', () => {
  const count = templates.frames.filter((frame) => frame.classOf === 'planet')
    .length
  expect(count).toBe(3)
})

test('Has all star templates', () => {
  const count = templates.frames.filter((frame) => frame.classOf === 'star')
    .length
  expect(count).toBe(4)
})

test('Has all galaxy templates', () => {
  const count = templates.frames.filter((frame) => frame.classOf === 'galaxy')
    .length
  expect(count).toBe(7)
})

// test('Has multipass template', () => {
//   const count = templates.frames.filter((frame) => frame.classOf === 'all').length
//   expect(count).toBe(1)
// })

test('Is shaped as expected', () => {
  expect(typeof templates.figmaPageID).toBe('string')
  expect(Array.isArray(templates.frames)).toBe(true)
})

test('No invalid paths in templates', () => {
  // The following are the valid data targets in the extendedWallet object. The use of other paths will cause an error. If you want to add more properties to the extendedWallet, you’ll need to do so in index.js of PaperRender. And don’t forget to update this list. (Aug 29 2019)
  const walletPaths = [
    'meta.generator.name',
    'meta.generator.version',
    'meta.spec',
    'meta.ship',
    'meta.patp',
    'meta.tier',
    'meta.derivationPath',
    'meta.passphrase',
    'meta.sigilDark',
    'meta.sigilLight',
    'meta.azimuth.url',
    'meta.renderer.version',
    'meta.renderer.name',
    'meta.dateCreated',
    'ticket',
    'shards.0',
    'shards.1',
    'shards.2',
    'ownership.type',
    'ownership.seed',
    'ownership.keys.public',
    'ownership.keys.private',
    'ownership.keys.chain',
    'ownership.keys.address',
    'transfer.type',
    'transfer.seed',
    'transfer.keys.public',
    'transfer.keys.private',
    'transfer.keys.chain',
    'transfer.keys.address',
    'spawn.type',
    'spawn.seed',
    'spawn.keys.public',
    'spawn.keys.private',
    'spawn.keys.chain',
    'spawn.keys.address',
    'voting.type',
    'voting.seed',
    'voting.keys.public',
    'voting.keys.private',
    'voting.keys.chain',
    'voting.keys.address',
    'management.type',
    'management.seed',
    'management.keys.public',
    'management.keys.private',
    'management.keys.chain',
    'management.keys.address',
    'network',
  ]

  const knownExceptions = []

  const validPaths = [...knownExceptions, ...walletPaths]

  const existingPaths = templates.frames.reduce((acc, frame) => {
    const elemPaths = frame.elements.map((elem) => elem.path)
    acc = acc.concat(elemPaths)
    return acc
  }, [])

  const violations = existingPaths.filter((path) => {
    return validPaths.includes(path) === false && path !== null
  })

  console.log('Violations:', violations)

  expect(violations.length).toBe(0)
})
