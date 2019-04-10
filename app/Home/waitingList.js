import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';

export default class WaitingList extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
          <ScrollView>
            <Text>Wating List</Text>
          </ScrollView>
        </View>
    );
  }
}