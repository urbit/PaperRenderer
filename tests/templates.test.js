const fs = require('fs')
const flat = require('flat')

const templates = JSON.parse(
  fs.readFileSync(__dirname + '/../lib/src/templates.json', 'utf8')
)

test('Has all planet templates', () => {
  const count = templates.pages.filter((page) => page.classOf === 'planet')
    .length
  expect(count).toBe(3)
})

test('Has all star templates', () => {
  const count = templates.pages.filter((page) => page.classOf === 'star').length
  expect(count).toBe(4)
})

test('Has all galaxy templates', () => {
  const count = templates.pages.filter((page) => page.classOf === 'galaxy')
    .length
  expect(count).toBe(7)
})

// test('Has multipass template', () => {
//   const count = templates.pages.filter((page) => page.classOf === 'all').length
//   expect(count).toBe(1)
// })

test('Is shaped as expected', () => {
  expect(typeof templates.figmaPageID).toBe('string')
  expect(Array.isArray(templates.pages)).toBe(true)
})

test('No invalid paths in templates', () => {
  const walletPaths = [
    'meta.generator',
    'meta.paperRendererVersion',
    'meta.keyGeneratorVersion',
    'meta.dateCreated',
    'shard.0',
    'shard.1',
    'shard.2',
    'meta.walletVersion',
    'meta.ship',
    'meta.patp',
    'meta.tier',
    'meta.derivationPath',
    'meta.passphrase',
    'meta.sigilLight',
    'meta.sigilDark',
    'meta.azimuthUrl',
    'meta.createdOn',
    'ticket',
    'shards',
    'ownership.type',
    'ownership.seed',
    'ownership.keys.public',
    'ownership.keys.private',
    'ownership.keys.chain',
    'ownership.keys.address',
    // 'ownership.keys.addrQr',
    'transfer.type',
    'transfer.seed',
    'transfer.keys.public',
    'transfer.keys.private',
    'transfer.keys.chain',
    'transfer.keys.address',
    // 'transfer.keys.addrQr',
    'spawn.type',
    'spawn.seed',
    'spawn.keys.public',
    'spawn.keys.private',
    'spawn.keys.chain',
    'spawn.keys.address',
    // 'spawn.keys.addrQr',
    'voting.type',
    'voting.seed',
    'voting.keys.public',
    'voting.keys.private',
    'voting.keys.chain',
    'voting.keys.address',
    // 'voting.keys.addrQr',
    'management.type',
    'management.seed',
    'management.keys.public',
    'management.keys.private',
    'management.keys.chain',
    'management.keys.address',
    // 'management.keys.addrQr',
    'network',
  ]

  const knownExceptions = ['shard.number']

  const validPaths = [...knownExceptions, ...walletPaths]

  const existingPaths = templates.pages.reduce((acc, page) => {
    const elemPaths = page.elements.map((elem) => elem.path)
    acc = acc.concat(elemPaths)
    return acc
  }, [])

  const violations = existingPaths.filter((path) => {
    return validPaths.includes(path) === false && path !== null
  })

  console.log('Violations:', violations)

  expect(violations.length).toBe(0)
})

// test('No invalid component pointers in templates', () => {
//   const validComponents = []
//
//
// })
