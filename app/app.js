import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {NativeModules} from 'react-native';
import {DeviceEventEmitter} from 'react-native';

class App extends Component {
  constructor() {
    super();
    this.state = {result: null, devices: []};
  }

  componentDidMount() {
    if (
      NativeModules.ReactBridge !== undefined &&
      NativeModules.ReactBridge.add !== null
    ) {
      NativeModules.ReactBridge.add(1, 2).then(res =>
        this.setState({result: res}),
      );

      DeviceEventEmitter.addListener('device', (device) => {
        this.setState(prevState => ({
          devices: [...prevState.devices, device]
        }))
      });
    }
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
