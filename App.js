/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import firebase from 'react-native-firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.refCategory = firebase.firestore().collection('waste_category').orderBy("name_th");

    this.state = {
      loading: true,
      categories: [],
      subCategories: [],
      selectedCategory: "fav",
      selectedSubCate: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.refCategory.onSnapshot(this._onCollectionUpdate) 
  }

  _onCollectionUpdate = (querySnapshot) => {
    const categories = [];
    querySnapshot.forEach((doc) => {
      const {name_th, icon} = doc.data();
      categories.push({
        key: doc.id,
        doc,
        title: name_th,
        icon
      });
    });
    this.setState({ 
      categories,
      loading: false,
    });
  }

  render() {
    let mainCateDisplayArray = this.state.categories.map((item, key) => {
      return (
          <View>
            <View style={{
              width: 60,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 5,
              marginRight: 5,
            }}>
              <Text >{item.title}</Text>
            </View>
          </View>
      );
    });
    return (
      <View style={styles.container}>
        {mainCateDisplayArray}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map: {
      ...StyleSheet.absoluteFillObject,
      position: 'absolute'
  },
});
