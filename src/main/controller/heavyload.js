import {heavyLoadWindow} from '../index'

export const sendHeavyLoad = (eventName, payload) => {
  heavyLoadWindow.send(eventName, payload)
}
