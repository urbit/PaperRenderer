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

async function createWallet(patp) {
  let config = {
    ticket: patp,
    ship: ob.patp2dec(patp),
  }
  let wallet = await kg.generateWallet(config)
  return wallet
}

// string: outputPath
// optional bool: planet wallet generation, default true
// optional bool: star wallet generation, default true
// optional bool: galaxy wallet generation, default true
// optional int: num of sampleWallet files to generate, default 1
async function createSampleWallets(
  outputPath = OUTPUT_PATH,
  planet = true,
  star = true,
  galaxy = true,
  num = NUM_WALLET_FILES
) {
  for (var i = 0; i < num; i++) {
    var sampleWallet = []
    const path = `${outputPath}/sampleWallet${i}.json`
    if (planet)
      createWallet(randPlanet())
        .then((w) => {
          sampleWallet.push(w)
        })
        .then(() => {
          if (star)
            createWallet(randStar())
              .then((w) => {
                sampleWallet.push(w)
              })
              .then(() => {
                if (galaxy)
                  createWallet(randGalaxy())
                    .then((w) => {
                      sampleWallet.push(w)
                    })
                    .then(() => {
                      writeData(sampleWallet, path)
                      console.log(
                        `Saved ${num} wallet(s) in ${outputPath}. \nWallet types: planet--${planet}, star--${star}, galaxy--${galaxy}`
                      )
                    })
              })
        })
  }
}

createSampleWallets()
