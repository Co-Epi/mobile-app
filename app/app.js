import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeModules} from 'react-native';

class App extends Component {
  constructor() {
    super();
    this.state = {result: null};
  }

  componentDidMount() {
    NativeModules.ReactBridge.add(1, 2).then(res =>
      this.setState({result: res}),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>CoEpi</Text>
        <Text>
          {this.state.result === null ? 'Loading…' : this.state.result}
        </Text>
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
