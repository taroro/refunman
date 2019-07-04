import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, Platform} from 'react-native'
import {Button, Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import {Appbar} from 'react-native-paper'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ItemList from '../Receipt/itemList'
import Spinner from 'react-native-loading-spinner-overlay';

export default class ReceiptStep1 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      quotationId: this.props.quotationId,
      items: [],
    }
  }

  componentDidMount() {
    this._deLoading()
  }

  componentWillUnmount() {
  }

  _onPostUpdate = (postSnapshot) => {
  }

  _confirmReceipt = () => {
    Actions.confirmreceipt({
      quotationId: this.state.quotationId,
      itemArray: this.state.items
    })
  }

  _updateItemData = (items) => {
    this.setState({
      items: items,
      loading: true
    }, () => { this._deLoading() })
  }

  _deLoading = () => {
    this.setState({
      loading: false
    })
  }

  _onPressMenuButton() {
    Actions.pop()
  }
  
  render() {
    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: 'always'}}>
        <View style={{height: 55}}>
          <Appbar.Header style={{textAlign: 'center', backgroundColor: theme.PRIMARY_COLOR, marginBottom: 0}}>
            <Appbar.Action icon='arrow-back' color={theme.COLOR_WHITE} onPress={this._onPressMenuButton} />
            <Appbar.Content 
              title='REFUN MAN'
              color={theme.COLOR_WHITE}
              titleStyle={{fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_HEADER}}
            />
          </Appbar.Header>
        </View>
        <View style={{flex: 1}}>
          <Spinner
            visible={this.state.loading}
            animation={'fade'}
            textContent={'รอสักครู่...'}
            textStyle={{color:theme.PRIMARY_COLOR, fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_LARGE, fontWeight: "normal"}}
          />
          <ScrollView>
            <ItemList _updateItemDataToParent={this._updateItemData.bind(this)} />
          </ScrollView>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <Button mode='contained' color={theme.PRIMARY_COLOR} dark={true} onPress={this._confirmReceipt}>
              <Text style={{fontSize: 18, textAlign: 'center', fontFamily: theme.FONT_FAMILY, width: '80%'}}>บันทึกรายการรับซื้อ</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}