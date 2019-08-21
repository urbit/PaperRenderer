const kg = require('urbit-key-generation')
const ob = require('urbit-ob')
const fs = require('fs')

const OUTPUT_PATH = 'preview/src/js/sampleWallets'
const NUM_WALLET_FILES = 1

const randNumBit = (num) => {
  const min = Math.pow(2, num - 1) - 1
  const max = Math.pow(2, num) - 1
  return Math.random() * (max - min) + min
}

const main = async () => {
  const galaxy = {
    ship: 0,
    ticket: '~zod',
  }

  const star = {
    ship: 9128,
    ticket: '~binzod',
  }

  const planet = {
    ship: 3234674,
    ticket: '~ridlur',
  }

  const galaxyWallet = await kg.generateWallet(galaxy)
  const starWallet = await kg.generateWallet(star)
  const planetWallet = await kg.generateWallet(planet)
  console.log(galaxyWallet)

  const wallets = [galaxyWallet, starWallet, planetWallet]

  const json = JSON.stringify(wallets, null, 2)

  fs.writeFileSync(`${OUTPUT_PATH}/sampleWallets.json`, json, (err) => {
    if (err) throw err
  })
}

// main()

const randGalaxy = () => {
  return ob.patp(randNumBit(8))
}
const randStar = () => {
  return ob.patp(randNumBit(16))
}
const randPlanet = () => {
  return ob.patp(randNumBit(32))
}

const writeData = (data, path) => {
  const fmtData = JSON.stringify(data, null, 2)
  fs.writeFile(path, fmtData, (err) => {
    if (err) throw err
  })
}

const createWallet = async () => {
  const patp = randGalaxy()
  const num = ob.patp2dec(patp)

  const config = {
    ship: 152,
    ticket: '~fep',
  }

  // config.ship = num
  // config.ticket = patp

  console.log(config)
  let wallet = await kg.generateWallet(config)
  console.log(wallet)
  // return wallet
}

createWallet()

// string: outputPath
// optional bool: planet wallet generation, default true
// optional bool: star wallet generation, default true
// optional bool: galaxy wallet generation, default true
// optional int: num of sampleWallet files to generate, default 1
// async function createSampleWallets(
//   outputPath = OUTPUT_PATH,
//   planet = true,
//   star = true,
//   galaxy = true,
//   num = NUM_WALLET_FILES
// ) {
//   // for (var i = 0; i < num; i++) {
//     var sampleWallet = []
//     const path = `${outputPath}/sampleWallet.json`
//
//     const planetWallet = await createWallet(randPlanet())
//     const starWallet = await createWallet(randStar())
//     const galaxyWallet = await createWallet(randGalaxy())
//
//     // if (planet) {
//     //   sampleWallet.push(planetWallet)
//     // }
//     // if (star) {
//     //   sampleWallet.push(starWallet)
//     // }
//     // if (galaxy) {
//     //   sampleWallet.push(galaxyWallet)
//     // }
//
//     writeData(galaxyWallet, path)
//
//     console.log(
//       `Saved ${num} wallet(s) in ${outputPath}. \nWallet types: planet--${planet}, star--${star}, galaxy--${galaxy}`
//     )
//   // }
// }

// createSampleWallets()
