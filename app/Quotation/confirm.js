import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView, Platform} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import moment from 'moment';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import {Appbar} from 'react-native-paper'

export default class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      postId: this.props.postId,
    };
  }

  _finishQuotation = e => {
    e.preventDefault();
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection("quotation").add({
      refunme_id: "qxNhLWm7pdzKAKu83cfQ",
      refunman_id: "2npz1Jm961SkAoP13PDS",
      //refunman_id: "qq8Ots5XZfoqYh4cRNcD",
      post_id: this.state.postId,
      sent_datetime: moment(new Date()).format('DD/MM/YYYY HH:mm'),
      status: 0,
    }).then((docRef) => {
      this.props.itemArray.map((item, key) => {
        docRef.collection("items").add({
          cate_id: item.itemData.mainCate,
          subcate_id: item.itemData.subCate,
          subcate_title: item.itemData.cateTitle,
          price_per_unit: item.itemData.quantity,
          unit: item.itemData.unit
        })
      })
    }).then(() => {
      Actions.home({
        tabIndex: 1
      })
    });
  }

  _onPressMenuButton() {
    Actions.pop();
  }

  render() {
    let itemDisplayArray = this.props.itemArray.map((item, key) => {
      return (
        <View key={"item"+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:5, justifyContent:"flex-start", alignItems: "flex-start", flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10, paddingRight:10}]}>{key+1}</Text>
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.itemData.cateTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:"flex-start", alignItems: "flex-end"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.itemData.quantity}</Text>
            </View>
            <View style={{flex:3, justifyContent:"flex-start", alignItems: "flex-start", paddingLeft: 5}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>บาท/{item.itemData.unit}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    });

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: "always"}}>
        <View style={{height: 55}}>
          <Appbar.Header style={{textAlign:'center', backgroundColor:theme.PRIMARY_COLOR, marginBottom:0}}>
            <Appbar.Action icon="arrow-back" color={theme.COLOR_WHITE} onPress={this._onPressMenuButton} />
            <Appbar.Content 
              title="REFUN MAN"
              color={theme.COLOR_WHITE}
              titleStyle={{fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_HEADER}}
            />
          </Appbar.Header>
        </View><View style={{flex: 1}}>
          <ScrollView>
            <View style={{alignItems:"stretch", flex:1, flexDirection:"column", justifyContent:"flex-start", width:"100%"}}>
              <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
                <View>
                  <Text style={[styles.textExtraLarge, , {paddingLeft:15, paddingTop: 10, color:theme.PRIMARY_COLOR}]}>ใบเสนอราคา</Text>
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
                  <View style={{marginTop:10, marginBottom:10, flexDirection:"row", paddingBottom:5}}>
                    <View style={{flex:5, justifyContent:"center", alignItems:"center"}}>
                      <Text style={[styles.textSmall,]}>รายการ</Text>
                    </View>
                    <View style={{borderLeftWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:2, justifyContent:"center", alignItems:"center"}}>
                      <Text style={[styles.textSmall,]}>ราคา</Text>
                    </View>
                    <View style={{borderRightWidth:1, borderLeftColor:theme.FONT_PRIMARY_COLOR}} />
                    <View style={{flex:3, justifyContent:"center", alignItems:"center"}}>
                      <Text style={[styles.textSmall,]}>หน่วย</Text>
                    </View>
                  </View>
                  <Divider />
                  <View style={{marginBottom:15}}>{itemDisplayArray}</View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <Button mode="contained" color={theme.PRIMARY_COLOR} dark={true} onPress={this._finishQuotation}>
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%"}}>ส่งใบเสนอราคา</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}