import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import {Button} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
// Custom Components
import NavBarRefun from '../components/NavBarRefun';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <NavBarRefun title='REFUN MAN' />
        <ScrollView contentContainerStyle={styles.container} >
        </ScrollView>
      </SafeAreaView>
    );
  }
}
