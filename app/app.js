import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {NativeModules} from 'react-native';
import {DeviceEventEmitter, NativeEventEmitter} from 'react-native';
const { Bridge } = NativeModules;

class App extends Component {
  constructor() {
    super();
    this.state = {result: null, devices: []};
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

      const module = NativeModules.Bridge
      console.log(`Bridge module: ${module}`)
      module.startDiscovery()
    }
  }

  handleDevice = (device) => {
    console.log('got device: ' + device) 
    this.setState(prevState => ({
      devices: [...prevState.devices, device]
    }))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>CoEpi</Text>
        <Text>
          {this.state.result === null ? 'Loading…' : this.state.result}
        </Text>

        <FlatList 
          keyExtractor={(item) => item.address} 
          renderItem={({item}) => <Text style={styles.item}>{`${item.address} ${item.name}`}</Text>}
          data={this.state.devices} 
        />
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
