import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {NativeModules} from 'react-native';
import {DeviceEventEmitter, NativeEventEmitter} from 'react-native';
const { Counter } = NativeModules;

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
        this.setState(prevState => ({
          devices: [...prevState.devices, device]
        }))
      });

    } else { // iOS
      const counterEmitter = new NativeEventEmitter(Counter)
      counterEmitter.addListener('device', (device) => { 
        console.log('got device: ' + device) 
      })
    }

    const counter = NativeModules.Counter
    console.log(`Counter module: ${counter}`)
    counter.increment()
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
