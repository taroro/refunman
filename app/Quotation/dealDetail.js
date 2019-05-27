import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, Platform, TextInput} from 'react-native'
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
import moment from 'moment';

export default class DealDetail extends Component {
  constructor(props) {
    super(props)
    this.unsubscribePost = null
    this.unsubscribeChat = null
    this.refPostDocument = firebase.firestore().collection('post').doc(this.props.postId)
    this.refQuotation = firebase.firestore().collection('quotation').doc(this.props.quotationId)
    this.refChatCollection = this.refQuotation.collection('chat').orderBy('send_datetime')

    this.state = {
      loading: true,
      postId: this.props.postId,
      postDetail: null,
      postItems: [],
      postPhotos: [],
      deviceLatitude: null,
      deviceLongitude: null,
      deviceLocationError:null,
      showDetail: false,
      items: [],
      quotationDetail: {},
      quotationItem: [],
      message: '',
      chats: [],
      chatSender: '',
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          deviceLatitude: position.coords.latitude,
          deviceLongitude: position.coords.longitude,
          deviceLocationError: null
        })
        this.unsubscribePost = this.refPostDocument.onSnapshot(this._onPostUpdate);
        this.unsubscribeChat = this.refChatCollection.onSnapshot(this._onChatUpdate);
      },
      (error) => this.setState({ error: error.message }),
      {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000},
    );
  }

  componentWillUnmount() {
    this.unsubscribePost();
    this.unsubscribeChat();
  }

  _onChatUpdate = (chatsCollection) => {
    var chats = [];
    chatsCollection.forEach((chat) => {
      var data = chat.data();
      chats.push({
        message: data.message,
        sendDatetime: data.send_datetime,
        sender: data.sender,
        receiver: data.receiver,
      });
    });
    this.setState({
      chats: chats
    })
  }

  _onPostUpdate = (postSnapshot) => {
    var promiseItems = new Promise((resolve, reject) => {
      this.refPostDocument.collection('items').get().then((itemCollection) => {
        var items = [];
        itemCollection.forEach((item) => {
          var data = item.data();
          items.push({
            id: item.id,
            quantity: data.quantity,
            subCategoryTitle: data.subcate_title,
            unit: data.unit
          });
        });
        resolve(items);
      });
    });

    var promisePhotos = new Promise((resolve, reject) => {
      this.refPostDocument.collection('photos').get().then((photoCollection) => {
        var photos = [];
        photoCollection.forEach((photo) => {
          var data = photo.data()
          photos.push({
            id: photo.id,
            title: data.title,
            url: data.url,
          })
        });
        resolve(photos);
      });
    });

    var promiseQuotation = new Promise((resolve, reject) => {
      this.refQuotation.get().then((quotation) => {
        var returnData = {
          quotationId: quotation.id,
          refunMeId: quotation.data().refunme_id,
          refunManId: quotation.data().refunman_id,
          status: quotation.data().status
        }
        resolve(returnData);
      });
    });

    var promiseQuotationItem = new Promise((resolve, reject) => {
      this.refQuotation.collection('items').get().then((itemCollection) => {
        var items = [];
        itemCollection.forEach((item) => {
          var data = item.data();
          items.push({
            cateId: data.cate_id,
            subcateId: data.subcate_id,
            cateTitle: data.subcate_title,
            pricePerUnit: data.price_per_unit,
            unit: data.unit,
            id: item.id,
          });
        });
        resolve(items);
      });
    });

    var postData = postSnapshot.data();
    Promise.all([
      promiseItems, 
      promisePhotos, 
      promiseQuotation, 
      promiseQuotationItem
    ]).then(([items, photos, quotation, quotationItem]) => {
      this.setState({
        postDetail: {
          key: postSnapshot.id,
          availableDateTime: postData.available_datetime,
          latitude: postData.latitude,
          longitude: postData.longitude,
          postDateTime: postData.post_datetime,
          postType: postData.post_type,
          refunMeId: postData.refunme_id,
          shortAddress: postData.short_address,
          fullAddress: postData.full_address,
        },
        postItems: items,
        postPhotos: photos,
        quotationDetail: quotation,
        quotationItem: quotationItem,
        loading: false,
        chatSender: quotation.refunManId,
      })
    })
  }

  _acceptedDeal = () => {
    this.refQuotation.update({
      status: 2
    }).then((doc) => {
      firebase.firestore().collection('post').doc(this.props.postId).update({
        status: 2
      }).then((doc) => {
        Actions.home({
          tabIndex: 2
        })
      })
    })
  }

  _toggleDetail = () => {
    this.setState({
      showDetail: !this.state.showDetail
    })
  }

  _onPressMenuButton() {
    Actions.pop()
  }

  _sendMessage() {
    this.refQuotation.collection('chat').add({
      message: this.state.message,
      send_datetime: moment(new Date()).format('DD/MM/YYYY HH:mm'),
      sender: this.state.quotationDetail.refunManId,
      receiver: this.state.quotationDetail.refunMeId,
    }).then((doc) => {
      this.setState({
        message: ''
      })
    })
  }

  _sendLocation() {

  }
  
  render() {
    let chatsDisplay = (this.state.chats.length > 0 && this.state.chatSender != '')?this.state.chats.map((chat, key) => {
      return (
        <View key={'chat'+key} style={{width: '100%', margin: 10}}>
          {(this.state.chatSender == chat.sender)?
          <View style={{width: '100%', alignItems: 'flex-end'}}>
            <View style={{width: '65%', borderRadius: 10, backgroundColor:theme.PRIMARY_COLOR, padding: 10, marginRight: 20}}>
            <Text style={[styles.textNormal, {color: theme.COLOR_WHITE}]}>{chat.message}</Text></View>
          </View>
          :
          <View style={{width: '100%', alignItems: 'flex-start'}}>
            <View style={{width: '65%', borderRadius: 10, backgroundColor:theme.COLOR_WHITE, padding: 10, marginRight: 20}}>
            <Text style={[styles.textNormal, {color: theme.COLOR_DARKGREY}]}>{chat.message}</Text></View>
          </View>
          }
        </View>
      )
    }):null

    let photosDisplay = (this.state.postPhotos.length > 0)?this.state.postPhotos.map((photo, key) => {
      return (
        <Image key={'photo'+key} style={[styles.thumbnailPhoto]} source={{uri: photo.url}} />
      );
    }):null
    let itemsDisplay = (this.state.postItems.length > 0)?this.state.postItems.map((item, key) => {
      return (
        <View key={'item'+key}>
          <Divider/>
          <View style={[styles.itemRowPost]}>
            <View style={{flex: 3, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row'}}>
              <View style={{marginLeft: 5}}>
                <Text style={[styles.textSmall, {paddingLeft: 10}]}>{key+1}.</Text>
              </View>
              <View>
                <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.subCategoryTitle}</Text>
              </View>
            </View>
            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[styles.textSmall, {paddingLeft: 10}]}>{item.quantity}  {item.unit}</Text>
            </View>
          </View>
        </View>
      );
    }):null

    let quotationItemDisplay = (this.state.quotationItem.length > 0)?this.state.quotationItem.map((item, key) => {
      return (
        <View key={"item"+key}>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:5, justifyContent:"flex-start", alignItems: "flex-start", flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10, paddingRight:10}]}>{key+1}.</Text>
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.cateTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:"flex-start", alignItems: "flex-end"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.pricePerUnit}</Text>
            </View>
            <View style={{flex:3, justifyContent:"flex-start", alignItems: "flex-start", paddingLeft: 5}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>บาท/{item.unit}</Text>
            </View>
          </View>
          <Divider />
        </View>
      );
    }):null;
    let postDetail = this.state.postDetail
    let date = (postDetail == null)?'':DateFormat(postDetail.availableDateTime)
    let postDate = (postDetail == null)?'':DateFormat(postDetail.postDateTime)
    let distance = (postDetail == null || this.state.deviceLatitude == null)?null:geolib.getDistance(
      {latitude: this.state.deviceLatitude, longitude: this.state.deviceLongitude},
      {latitude: postDetail.latitude, longitude: postDetail.longitude}
    )
    let textDistance = (distance == null)?'':DistanceFormat(distance)

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
          <ScrollView
            ref={ref => this.scrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight)=>{        
                this.scrollView.scrollToEnd({animated: true});
            }}>
            {(postDetail == null)?null:
            <View style={{marginTop: 20, marginLeft: 15, marginRight: 15}}>
              <View style={{
                backgroundColor:theme.BACKGROUND_SECONDARY_COLOR, 
                borderRadius:10, width: '100%', elevation:(Platform.OS === 'ios'?0:2),
                shadowColor: theme.BACKGROUND_PRIMARY_COLOR,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.9,
                shadowRadius: 2}}>
                <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                  {(this.state.quotationDetail.status == 0)?
                  <Text style={[styles.textNormal]}>ใบเสนอราคากำลังรอการตอบรับ</Text>
                  :
                  <Text style={[styles.textHeader, {paddingTop: 10, color: theme.PRIMARY_COLOR}]}>ใบเสนอของคุณได้รับการเลือก</Text>
                  }
                </View>
                  <View>
                    <View style={{flex: 3, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'flex-start'}}>
                        <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: theme.PRIMARY_COLOR, paddingBottom: 0, width: '100%', borderRadius: 20, marginLeft:20, marginTop:10}}>
                          <Text style={[styles.textLargest, {color: theme.COLOR_WHITE, textAlign: 'center', marginBottom:-15}]}>{textDistance}</Text>
                          <Text style= {[styles.textExtraLarge, {color: theme.COLOR_WHITE, textAlign: 'center'}]}>KM</Text>
                        </View>
                      </View>
                      <View style={{borderLeftWidth: 2, borderLeftColor: theme.BACKGROUND_PRIMARY_COLOR, height: 105, marginLeft: 20, marginRight: 15, marginTop:10}} />
                      <View style={{flex: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                          <Text style={[styles.textExtraLarge, {color: theme.PRIMARY_COLOR, textAlign: 'left'}]}>วัน{date.dateShow}ที่ {date.dateNum}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: -5}}>
                          <Text style={[styles.textNormal, {color: theme.COLOR_DARKGREY, textAlign: 'center'}]}>{date.monthFullText+' '+date.year}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={[styles.textTiny, {color: theme.COLOR_DARKGREY, textAlign: 'left'}]}>{postDetail.shortAddress}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                      <Text style={[styles.textTiny]}>ประกาศ{postDate.today?'วันนี้':'เมื่อวัน'+postDate.dayFullText+'ที่ '+postDate.dateNum+' '+postDate.monthFullText+' '+postDate.year} {postDate.timeText+' น.'}</Text>
                    </View>
                  { this.state.showDetail?
                    <View>
                      <View style={[styles.confirmPhotoContainer]}>
                        {photosDisplay}
                      </View>
                      <View><Text style={[styles.textHeader, {paddingLeft: 15, paddingTop: 10, color: theme.PRIMARY_COLOR}]}>รายการสิ่งของ</Text></View>
                      <View >{itemsDisplay}</View>
                    {(quotationItemDisplay.length > 0)?
                      <View>
                        <View><Text style={[styles.textHeader, {paddingLeft: 15, paddingTop: 10, color: theme.PRIMARY_COLOR}]}>รายการสิ่งของที่เสนอราคา</Text></View>
                        <View >{quotationItemDisplay}</View>
                      </View>:null
                    }
                    </View>:null
                  }
                </View>
                <Divider/>
                <TouchableOpacity onPress={() => this._toggleDetail()}>
                  { this.state.showDetail?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10, flexDirection: 'row'}}>
                      <Icon name='arrow-upward' size={15} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Text style={[styles.textNormalGreen, {marginLeft: 10}]}>ซ่อนรายละเอียด</Text>
                    </View>
                    :
                    <View style={{flex:1, justifyContent: 'center', alignItems:'center', marginTop:10, marginBottom:10, flexDirection: 'row'}}>
                      <Icon name='arrow-downward' size={15} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                      <Text style={[styles.textNormalGreen, {marginLeft: 10}]}>แสดงรายละเอียด</Text>
                    </View>
                  }
                </TouchableOpacity>
              </View>
            </View>
            }
            <View style={{flex: 1, widht: '100%', margin: 10}}>{chatsDisplay}</View>
          </ScrollView>
          {(this.state.quotationDetail.status == 1)?
            <View style={{padding: 15, backgroundColor: theme.BACKGROUND_SECONDARY_COLOR}}>
              <View style={{width: '100%', marginBottom: 10}}>
                <Text style={[styles.textTiny, {textAlign: "center"}]}>คุณได้รับการตอบรับข้อเสนอโปรดยืนยัน</Text>
              </View>
              <Button mode="contained" color={theme.PRIMARY_COLOR} dark={true} onPress={this._acceptedDeal}>
                <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%"}}>ยืนยันรับซื้อ</Text>
              </Button>
            </View>:null
          }
          {(this.state.quotationDetail.status == 2)?
            <View style={{padding: 10, backgroundColor: theme.BACKGROUND_SECONDARY_COLOR, flexDirection: 'row', height: 60}}>
              <View style={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this._sendLocation}>
                  <Icon name='add-location' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                </TouchableOpacity>
              </View>
              <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                <TextInput
                  style={{height:40, borderRadius:10, width: '100%', backgroundColor: theme.COLOR_WHITE, paddingLeft:10, paddingRight:10,}}
                  onChangeText={(message) => this.setState({message})}
                  value={this.state.message}
                  autoFocus
                />
              </View>
              <View style={{width: 40, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this._sendMessage()}>
                  <Icon name='send' size={30} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
                </TouchableOpacity>
              </View>
            </View>:null
          }
        </View>
      </SafeAreaView>
    )
  }
}