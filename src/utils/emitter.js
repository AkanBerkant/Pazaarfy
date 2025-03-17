import { DeviceEventEmitter } from 'react-native';

const Emitter = {
  on: (event, fn) => { return DeviceEventEmitter.addListener(event, fn); },
  once: (event, fn) => { return DeviceEventEmitter.once(event, fn); },
  off: (event, fn) => { return DeviceEventEmitter.off(event, fn); },
  emit: (event, payload) => { return DeviceEventEmitter.emit(event, payload); },
};
Object.freeze(Emitter);
export default Emitter;
