import React, {Component} from 'react'
import {View, SafeAreaView} from 'react-native'
import {TabView, TabBar, SceneMap, type NavigationState} from 'react-native-tab-view'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Appbar} from 'react-native-paper'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import NewPostList from './newPostList'
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
    index: (this.props.tabIndex)?this.props.tabIndex:0,
    routes: [
      { key: 'newpost', title: 'ประกาศใหม่', icon: 'assignment' },
      { key: 'waiting', title: 'รอการตอบรับ', icon: 'sms' },
      { key: 'dealed', title: 'รอรับซื้อ', icon: 'check-circle' },
    ],
  }

  _handleIndexChange = index =>
    this.setState({
      index,
    })

  _renderIcon = ({route, focused, color}) => (
    <Icon name={route.icon} size={28} color={color} />
  )

  _renderTabBar = props => {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        renderIcon={this._renderIcon}
        style={styles.tabbar}
        activeColor={theme.PRIMARY_COLOR}
        inactiveColor={theme.COLOR_GREY}
        labelStyle={styles.tabLabel}
      />
    )
  }

  _onPressMenuButton() {

  }

  _renderScene = SceneMap({
    newpost: NewPostList,
    waiting: WaitingList,
    dealed: DealedList,
  })

  render() {
    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <View style={{height: 55}}>
          <Appbar.Header style={{textAlign: 'center', backgroundColor: theme.PRIMARY_COLOR, marginBottom: 0}}>
            <Appbar.Action icon="menu" color={theme.COLOR_WHITE} onPress={this._onPressMenuButton} />
            <Appbar.Content 
              title="REFUN MAN"
              color={theme.COLOR_WHITE}
              titleStyle={{fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_HEADER}}
            />
          </Appbar.Header>
        </View>
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