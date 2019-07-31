import * as Figma from 'figma-js';

const TOKEN = '1952-9da74b1b-551c-4acf-83b4-23b31743ab51'

const client = Figma.Client({ personalAccessToken: TOKEN })

const figma = {
  pull: (documentRef, callback) => {
    client.file(documentRef)
      .then(({ data }) => { callback(data) })
      .catch(err => console.error('figma.get() choked: ', err))
  }
}

export default figma
