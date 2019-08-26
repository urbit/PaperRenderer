// interfaces
interface Element {
  // Common among all
  x: number
  y: number
  type: string
  path: string
  data: any
  // images, sigil + qr
  size?: number
  width?: number
  height?: number
  // type
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  maxWidth?: number
  lineHeightPx?: number
  fontColor?: string
  // rectangles or other shapes
  cornerRadius?: number
  dashes?: number[]
  fillColor?: string
  strokeColor?: string
  strokeWeight?: string
}

interface WalletNode {
  seed: string
  keys: {
    public: string
    private: string
    chain: string
    address: string
  }
}

interface WalletMeta {
  ship: string
  patp: string
  tier: string
  derivationPath: string
  passphrase: string
}

interface Wallet {
  meta: WalletMeta
  ticket: string
  shards: string[]
  ownership: WalletNode
  transfer: WalletNode
  spawn: WalletNode
  voting: WalletNode
  management: WalletNode
  network: WalletNode
}

interface ExtendedWalletNode extends WalletNode {
  seed: string
  keys: {
    addrQr: any
    public: string
    private: string
    chain: string
    address: string
  }
}

interface ExtendedWalletMeta extends WalletMeta {
  sigil: any
  azimuthUrl: string
  createdOn: string
}

interface ExtendedWallet extends Wallet {
  meta: ExtendedWalletMeta
  ownership: ExtendedWalletNode
  transfer: ExtendedWalletNode
  spawn: ExtendedWalletNode
  voting: ExtendedWalletNode
  management: ExtendedWalletNode
  network: ExtendedWalletNode
}

interface Page {
  classOf: string
  usage: string
  bin: string
  elements: Element[]
  originX: number
  originY: number
  dataPath: string
}

interface Templates {
  assets: any[]
  pages: Page[]
}

interface Pair {
  wallet: ExtendedWallet
  templates: ExtendedTemplates
}
