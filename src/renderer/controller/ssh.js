const NodeRSA = require('node-rsa')
// const keypair = require('keypair')
// todo native on linux and mac
const forge = require('node-forge')
export const createKeyPair = (bitLength) => {
  return new Promise((resolve, reject) => {
    try {
      const key = new NodeRSA()
      const keyPair = key.generateKeyPair(bitLength)
      const publicKeyForge = forge.pki.publicKeyFromPem(keyPair.exportKey('public'))
      resolve({
        privateKey: keyPair.exportKey('private'),
        publicKey: forge.ssh.publicKeyToOpenSSH(publicKeyForge, `name@test`)
      })
    } catch (e) {
      reject(e)
    }
  })
}
