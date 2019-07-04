import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, Platform} from 'react-native'
import {Button, Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import geolib from 'geolib'
import {DistanceFormat} from '../helpers/DistanceFormat'
import {DateFormat} from '../helpers/DateFormat'
import {Appbar} from 'react-native-paper'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment'

export default class ConfirmReceipt extends Component {
  constructor(props) {
    super(props)
    this.refQuotation = firebase.firestore().collection('quotation').doc(this.props.quotationId)
    this.state = {
      loading: true,
      quotationId: this.props.quotationId,
      items: this.props.itemArray,
      postId: '',
      refunMeId: '',
      status: 0,
    }
  }

  componentDidMount() {
    this.refQuotation.get().then((quotation) => {
      this.setState({
        postId: quotation.data().post_id,
        refunMeId: quotation.data().refunme_id,
        status: quotation.data().status
      })
    });
    this._deLoading()
  }

  componentWillUnmount() {
  }

  _deLoading = () => {
    this.setState({
      loading: false
    })
  }

  _onPressMenuButton() {
    Actions.pop()
  }

  _confirmReceipt = e => {
    e.preventDefault();
    const db = firebase.firestore();
    db.collection("receipt").add({
      quotation_id: this.state.quotationId,
      post_id: this.state.postId,
      refunme_id: this.state.refunMeId,
      refunman_id: global.refunManId,
      sent_datetime: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    }).then((docRef) => {
      this.state.items.map((item, key) => {
        docRef.collection("items").add({
          cate_id: item.itemData.mainCate,
          subcate_id: item.itemData.subCate,
          subcate_title: item.itemData.cateTitle,
          quantity: item.itemData.quantity,
          price_per_unit: item.itemData.price,
          unit: item.itemData.unit,
        })
      })
    }).then(() => {
      this.refQuotation.update({
        status: 3
      }).then((doc) => {
        Actions.home({
          tabIndex: 2
        })
      })
    });
  }
  
  render() {
    var totalAll = 0
    let itemDisplayArray = this.state.items.map((item, key) => {
      var total = parseFloat(item.itemData.quantity) * parseFloat(item.itemData.price);
      totalAll += total
      return (
        <View key={'item'+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex: 5, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft: 10, paddingRight: 10}]}>{key+1}</Text>
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.itemData.cateTitle}</Text>
              </View>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.itemData.quantity}</Text>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
              <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.itemData.price}</Text>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start', alignItems: 'flex-end', paddingLeft: 5}}>
              <Text style={[styles.textSmall, {paddingRight: 10}]}>{total}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    });

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
            <View style={{alignItems: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', width: '100%'}}>
              <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                <View>
                <Text style={[styles.textExtraLarge, {paddingLeft:15, paddingTop: 10, color:theme.PRIMARY_COLOR}]}>ใบรายการรับซื้อ</Text>
                </View>
              </View>
              <View style={{flex:1, marginTop:10, marginLeft:15, marginRight:15}}>
                <View style={{
                  backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, 
                  borderRadius:10, width: '100%', elevation:(Platform.OS === 'ios'?0:2),
                  shadowColor: theme.BACKGROUND_PRIMARY_COLOR,
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.9,
                  shadowRadius: 2}}>
                  <View style={{marginTop:10, marginBottom:10, flexDirection:'row', paddingBottom:5}}>
                    <View style={{flex:5, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>รายการ</Text>
                    </View>
                    <View style={{borderLeftWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>จำนวน</Text>
                    </View>
                    <View style={{borderRightWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>ราคา/หน่วย</Text>
                    </View>
                    <View style={{borderRightWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:'center', alignItems:'center'}}>
                      <Text style={[styles.textTiny,]}>รวม</Text>
                    </View>
                  </View>
                  <Divider />
                  <View>{itemDisplayArray}</View>
                  <View style={{marginTop:10, marginLeft:15, marginRight:15, marginBottom: 15, flexDirection: "row"}}>
                    <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>ยอดรวม</Text>
                    <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>{totalAll.toFixed(2)}</Text>
                    <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>บาท</Text>
                  </View>
                </View>
              </View>
              {/* <View style={{flex: 1, marginTop:10, alignContent: "center", alignItems: "center"}}>
                <Image style={{borderRadius:10, width: 250, height: 250, alignSelf: "center"}} source={{uri:"https://promptpay.io/0825880022/"+totalAll+".png"}} />
                <Text style={[styles.textHeader, {color:theme.PRIMARY_COLOR, marginTop: 10, textAlign: "center"}]}>สแกน QR เพื่อโอนเงิน{"\n"}ผ่าน PromptPay</Text>
              </View> */}
            </View>
          </ScrollView>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <Button mode='contained' color={theme.PRIMARY_COLOR} dark={true} onPress={this._confirmReceipt}>
              <Text style={{fontSize: 18, textAlign: 'center', fontFamily: theme.FONT_FAMILY, width: '80%'}}>ส่งใบรายการรับซื้อ</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}