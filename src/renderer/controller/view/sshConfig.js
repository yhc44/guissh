import {mapActions} from 'vuex'
export default {
  methods: {
    ...mapActions('sshManager', ['createSSHKeyPair']),
    async createSSHKeyPairView (bitLength, outputFileName) {
      this.$wait.start('creating_keypair')
      console.log(`Create KeyPair with ${bitLength} bits`)
      this.createSSHKeyPair({
        outputFileName: outputFileName,
        bitLength: bitLength
      }).then(() => {
        this.$wait.end('creating_keypair')
        console.log(`Created KeyFile ${outputFileName}`)
      }).catch(err => {
        this.$wait.end('creating_keypair')
        console.log(err)
      })
    },
    selectConfigEntryIdentityFilePath () {
    }
  }
}
