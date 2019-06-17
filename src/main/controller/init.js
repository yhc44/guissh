import SSHManager from '../classes/sshManager'
export const initApp = async () => {
  const sshManager = new SSHManager({
    sshBasePath: '/Users/heeser/.ssh',
    sshAuthFileName: 'authorized_keys',
    sshConfigFileName: 'config'
  })
  await sshManager.init().then(_ => {
    console.log('SSHManager init successful')
  })
  const configData = sshManager.getSSHConfigData()
  for (const configKey of Object.keys(configData)) {
    configData[configKey].edit()
  }
}
