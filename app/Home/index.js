import React, {Component} from 'react';
import {StyleSheet, Text, View, SafeAreaView, TouchableWithoutFeedback} from 'react-native';
import {TabView, TabBar, SceneMap, type NavigationState} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import {Button} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
// Custom Components
import NavBarRefun from '../components/NavBarRefun';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NewPostList from './newPostList';
import WaitingList from './waitingList'
import DealedList from './dealedList'

type State = NavigationState<{
  key: string,
  title: string,
  icon: string,
}>;

export default class Home extends Component<*, State> {
  static appbarElevation = 0;

  state = {
    index: 0,
    routes: [
      { key: 'newpost', title: 'ประกาศใหม่', icon: 'file-text' },
      { key: 'waiting', title: 'รอการตอบรับ', icon: 'message-circle' },
      { key: 'dealed', title: 'รอรับซื้อ', icon: 'check-circle' },
    ],
  };

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderIcon = ({ route, focused, color }) => (
    <Icon name={route.icon} size={28} color={color} />
  );

  _renderTabBar = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        renderIcon={this._renderIcon}
        style={styles.tabbar}
        activeColor={theme.COLOR_LIGHTGREEN}
        inactiveColor={theme.COLOR_GREY}
        labelStyle={styles.tabLabel}
      />
    );
  };

  _renderScene = SceneMap({
    newpost: NewPostList,
    waiting: WaitingList,
    dealed: DealedList,
  });

  render() {
    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <NavBarRefun title='REFUN MAN' action='home' />
        <TabView
          lazy
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
        />
      </SafeAreaView>
    );
  }
}