const kg = require('urbit-key-generation')
const ob = require('urbit-ob')
const fs = require('fs')

const OUTPUT_PATH = 'preview/src/js/sampleWallets'
const NUM_WALLET_FILES = 1

const randNumBit = (num) => {
  const min = Math.pow(2, num - 1) - 1
  const max = Math.pow(2, num) - 1
  return Math.floor(Math.random() * (max - min) + min)
}

const writeData = (data, path) => {
  const fmtData = JSON.stringify(data, null, 2)
  fs.writeFile(path, fmtData, (err) => {
    if (err) throw err
  })
}

// string: outputPath
// optional bool: planet wallet generation, default true
// optional bool: star wallet generation, default true
// optional bool: galaxy wallet generation, default true
// optional int: num of sampleWallet files to generate, default 1
const createSampleWallets = async (
  outputPath = OUTPUT_PATH,
  planet = true,
  star = true,
  galaxy = true,
  num = NUM_WALLET_FILES
) => {
  for (var i = 0; i < num; i++) {
    var sampleWallet = []
    const path = `${outputPath}/sampleWallet${i}.json`

    const planetWallet = await kg.generateWallet({
      ship: randNumBit(32),
      ticket: '~marbud-tidsev-litsut-hidfep',
    })
    const starWallet = await kg.generateWallet({
      ship: randNumBit(16),
      ticket: '~marbud-tidsev-litsut-hidfep',
    })
    const galaxyWallet = await kg.generateWallet({
      ship: randNumBit(8),
      ticket:
        '~wacfus-dabpex-danted-mosfep-pasrud-lavmer-nodtex-taslus-pactyp-milpub-pildeg-fornev-ralmed-dinfeb-fopbyr-sanbet-sovmyl-dozsut-mogsyx-mapwyc-sorrup-ricnec-marnys-lignex',
    })

    if (planet) {
      sampleWallet.push(planetWallet)
    }
    if (star) {
      sampleWallet.push(starWallet)
    }
    if (galaxy) {
      sampleWallet.push(galaxyWallet)
    }

    writeData(sampleWallet, path)

    console.log(
      `Saved ${num} wallet${
        num > 1 ? 's' : ''
      } in ${outputPath}. \nWallet types: planet--${planet}, star--${star}, galaxy--${galaxy}`
    )
  }
}

createSampleWallets()
