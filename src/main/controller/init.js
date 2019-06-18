import SSHManager from '../classes/sshManager'
export let sshManager = null

export const initApp = async () => {
  sshManager = new SSHManager()
  await sshManager.init().then(_ => {
    console.log('SSHManager init successful')
  })
}
