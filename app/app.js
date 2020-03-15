import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {NativeModules} from 'react-native';
import {DeviceEventEmitter, NativeEventEmitter} from 'react-native';
const { Bridge } = NativeModules;

class App extends Component {
  constructor() {
    super();
    this.state = {result: null, devices: [], peripheralState: null, contacts: []};
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

      emitter.addListener('contact', (contact) => { 
        this.handleContact(contact)
      })

      const module = NativeModules.Bridge
      console.log(`Bridge module: ${module}`)
      // module.startDiscovery()

      module.startAdvertising()
      module.startDiscovery()
    }
  }

  handleDevice = (device) => {
    // console.log('got device: ' + device) 
    // this.setState(prevState => ({
    //   devices: [...prevState.devices, device]
    // }))
  }

  handlePeripheralState = (peripheralState) => {
    console.log('got peripheral state: ' + peripheralState) 
    this.setState(prevState => ({
      peripheralState: peripheralState
    }))
  }

  handleContact = (contact) => {
    console.log('got contact: ' + contact) 
    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact]
    }))
    // TODO display
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>CoEpi</Text>
        <Text>
          {this.state.result === null ? 'Loading…' : this.state.result}
        </Text>
        <Text>
          {this.state.peripheralState === null ? 'Will show peripheral state here if using as peripheral' : this.state.peripheralState}
        </Text>
        <FlatList 
          keyExtractor={(item) => item.identifier} 
          renderItem={({item}) => <Text style={styles.item}>{`${item.identifier}`}</Text>}
          data={this.state.contacts} 
        />
        {/* <FlatList 
          keyExtractor={(item) => item.address} 
          renderItem={({item}) => <Text style={styles.item}>{`${item.address} ${item.name}`}</Text>}
          data={this.state.devices} 
        /> */}
      </View>
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

export default App;
