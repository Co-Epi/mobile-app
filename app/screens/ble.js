import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {NativeModules} from 'react-native';
import {DeviceEventEmitter, NativeEventEmitter} from 'react-native';
const { Bridge } = NativeModules;
import { Container } from 'native-base'
import { Header } from '../components/ui'

class BLE extends Component {
  constructor() {
    super();
    this.state = {result: null, devices: [], peripheralState: null};
  }

  componentDidMount() {
    if (
      NativeModules.ReactBridge !== undefined &&
      NativeModules.ReactBridge !== null &&
      NativeModules.ReactBridge.add !== null
    ) { // Android
      NativeModules.ReactBridge.add(1, 2).then(res =>
        this.setState({result: res}),
      );

      DeviceEventEmitter.addListener('device', (device) => {
        this.handleDevice(device)
      });

    } else { // iOS
      const emitter = new NativeEventEmitter(Bridge)
      emitter.addListener('device', (device) => { 
        this.handleDevice(device)
      })

      emitter.addListener('peripheralstate', (peripheralState) => { 
        this.handlePeripheralState(peripheralState)
      })

      const module = NativeModules.Bridge
      console.log(`Bridge module: ${module}`)
      // module.startDiscovery()

      module.startAdvertising()
    }
  }

  handleDevice = (device) => {
    console.log('got device: ' + device) 
    this.setState(prevState => ({
      devices: [...prevState.devices, device]
    }))
  }

  handlePeripheralState = (peripheralState) => {
    console.log('got peripheral state: ' + peripheralState) 
    this.setState(prevState => ({
      peripheralState: peripheralState
    }))
  }

  render() {
    return (
        <Container>
        <Header
            title="BLE"
        />
                <Text>
          {this.state.result === null ? 'Loading…' : this.state.result}
        </Text>
        <Text>
          {this.state.peripheralState === null ? 'Will show peripheral state here if using as peripheral' : this.state.peripheralState}
        </Text>

        <FlatList 
          keyExtractor={(item) => item.address} 
          renderItem={({item}) => <Text style={styles.item}>{`${item.address} ${item.name}`}</Text>}
          data={this.state.devices} 
        />
    </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});

export default BLE;
