const copy = {
  custody: {
    galaxy : {
      masterTicketShard: 'custody master ticket shard',
      masterTicket: 'custody galaxy master ticket',
      spawn: 'custody spawn',
      transfer: 'custody transfer',
      vote: 'custody vote',
      manage: 'custody manage',
    },
    star : {
      // masterTicketShard: 'custody master ticket shard',
      masterTicket: 'custody master ticket',
      spawn: 'custody spawn',
      transfer: 'custody transfer',
      // vote: 'custody vote',
      manage: 'custody manage',
    },
    planet : {
      // masterTicketShard: 'Nonexistant seed.',
      masterTicket: `Securely store this document.\nThe master ticket and ownership seed could be used to transfer ownership or impersonate your planet on the Urbit network.\nThe ownership seed is a BIP39 mnemonic, which can be used as the Master Seed for a hardware wallet.\nFor information on storing cryptographic material securely, see: http://urbit.org/docs/custody `,
      // spawn: 'Nonexistant seed.',
      transfer: 'custody transfer',
      // vote: 'custody vote',
      manage: 'custody manage',
    },
  },
  usage: {
    galaxy : {
      masterTicketShard: 'usage galaxy master ticket shard',
      masterTicket: 'usage galaxy master ticket',
      spawn: 'usage spawn',
      transfer: 'usage transfer',
      vote: 'usage vote',
      manage: 'usage manage',
    },
    star : {
      // masterTicketShard: 'usage star master ticket shard',
      masterTicket: 'usage  starmaster ticket',
      spawn: 'usage star spawn',
      transfer: 'usage star transfer',
      // vote: 'usage vote',
      manage: 'usage manage',
    },
    planet : {
      // masterTicketShard: 'usage master ticket shard',
      masterTicket: 'usage master ticket',
      // spawn: 'usage spawn',
      transfer: 'usage transfer',
      // vote: 'usage vote',
      manage: 'usage manage',
    },
  },
  meta: {
    walletVersion: 'UP33',
    moreInformation: 'urbit.org/docs/custody',
  }
};

export default copy;
