import React, {Component} from 'react'
import {Text, View, SafeAreaView, Image, ScrollView, Platform} from 'react-native'
import {Button, Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import geolib from 'geolib'
import {DistanceFormat} from '../helpers/DistanceFormat'
import {DateFormat} from '../helpers/DateFormat'
import {Appbar} from 'react-native-paper'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import Spinner from 'react-native-loading-spinner-overlay'

export default class PostDetail extends Component {
  constructor(props) {
    super(props)
    this.unsubscribePostDetail = null
    this.refPostDocument = firebase.firestore().collection('post').doc(this.props.postId)

    this.state = {
      loading: true,
      postId: this.props.postId,
      postDetail: null,
      postItems: [],
      postPhotos: [],
      deviceLatitude: null,
      deviceLongitude: null,
      deviceLocationError:null,
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          deviceLatitude: position.coords.latitude,
          deviceLongitude: position.coords.longitude,
          deviceLocationError: null,
          loading: false
        })
        this.unsubscribePostDetail = this.refPostDocument.onSnapshot(this._onPostUpdate)
      },
      (error) => this.setState({ error: error.message }),
    )
  }

  componentWillUnmount() {
    this.unsubscribePostDetail()
  }

  _goToQuotation = () => {
    Actions.quotationstep1({
      postId: this.state.postId
    })
  }

  _onPostUpdate = (postSnapshot) => {
    this.setState({loading: true})
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

    var postData = postSnapshot.data();
    Promise.all([promiseItems, promisePhotos]).then(([items, photos]) => {
      this.setState({
        postDetail: {
          id: postSnapshot.id,
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
        loading: false
      })
    })
  }

  _onPressMenuButton() {
    Actions.pop();
  }

  render() {
    let photosDisplay = (this.state.postPhotos.length > 0)?this.state.postPhotos.map((photo, key) => {
      return (
        <Image key={"photo"+key} style={[styles.thumbnailPhoto]} source={{uri:photo.url}} />
      );
    }):null
    let itemsDisplay = (this.state.postItems.length > 0)?this.state.postItems.map((item, key) => {
      return (
        <View key={"item"+key}>
          <Divider/>
          <View style={[styles.itemRowPost]}>
            <View style={{flex:3, justifyContent:"flex-start", alignItems: "flex-start", flexDirection:'row'}}>
              <View style={{marginLeft:5}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{key+1}.</Text>
              </View>
              <View style={{}}>
                <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.subCategoryTitle}</Text>
              </View>
            </View>
            <View style={{flex:2, justifyContent:"center", alignItems: "center"}}>
              <Text style={[styles.textSmall, {paddingLeft:10}]}>{item.quantity}  {item.unit}</Text>
            </View>
          </View>
        </View>
      );
    }):null
    let postDetail = this.state.postDetail
    let date = (postDetail == null)?"":DateFormat(postDetail.availableDateTime)
    let postDate = (postDetail == null)?"":DateFormat(postDetail.postDateTime)
    let distance = (postDetail == null || this.state.deviceLatitude == null)?null:geolib.getDistance(
      {latitude: this.state.deviceLatitude, longitude: this.state.deviceLongitude},
      {latitude: postDetail.latitude, longitude: postDetail.longitude}
    )
    let textDistance = (distance == null)?"":DistanceFormat(distance)

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
        </View>
        <View style={{flex: 1}}>
          <Spinner
            visible={this.state.loading}
            animation={'fade'}
            textContent={'รอสักครู่...'}
            textStyle={{color:theme.PRIMARY_COLOR, fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_LARGE, fontWeight: "normal"}}
          />
          <ScrollView>
            {(postDetail == null)?null:
            <View style={{marginTop: 20, marginLeft: 15, marginRight: 15}}>
              <View style={{
                backgroundColor: theme.BACKGROUND_SECONDARY_COLOR,
                borderRadius: 10, width: '100%', elevation:(Platform.OS === 'ios'?0:2),
                shadowColor: theme.BACKGROUND_PRIMARY_COLOR,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.9,
                shadowRadius: 2}}>
                <View style={{flex: 3, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'flex-start'}}>
                    <View style={{
                      flexDirection: 'column', alignItems: 'center', 
                      backgroundColor: theme.PRIMARY_COLOR, paddingBottom: 0, 
                      width: '100%', borderRadius: 20, marginLeft: 20, marginTop: 10}}>
                      <Text style={[styles.textLargest, {color: theme.COLOR_WHITE, textAlign: 'center', marginBottom: -15}]}>{textDistance}</Text>
                      <Text style= {[styles.textExtraLarge, {color: theme.COLOR_WHITE, textAlign: 'center'}]}>KM</Text>
                    </View>
                  </View>
                  <View style={{borderLeftWidth: 2, borderLeftColor: theme.BACKGROUND_PRIMARY_COLOR, height: 105, marginLeft: 20, marginRight: 15, marginTop: 10}} />
                  <View style={{flex: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                      <Text style={[styles.textExtraLarge, {color: theme.PRIMARY_COLOR, textAlign: 'left'}]}>วัน{date.dateShow}ที่ {date.dateNum}</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: -5}}>
                      <Text style={[styles.textNormal, {color: theme.COLOR_DARKGREY, textAlign: 'center'}]}>{date.monthShortText+" "+date.year} เวลา {date.timeText} น.</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.textTiny, {color: theme.COLOR_DARKGREY, textAlign: 'left'}]}>{postDetail.shortAddress}</Text>
                    </View>
                  </View>
                </View>
                <View style={{flex:1, alignItems:"center", marginTop:10}}>
                  <Text style={[styles.textTiny]}>ประกาศ{postDate.today?"วันนี้":"เมื่อวัน"+postDate.dayFullText+"ที่ "+postDate.dateNum+" "+postDate.monthFullText+" "+postDate.year} {postDate.timeText+" น."}</Text>
                </View> 
                <View style={[styles.confirmPhotoContainer]}>
                  {photosDisplay}
                </View>
                <View><Text style={[styles.textHeader, {paddingLeft:15, paddingTop: 10, color:theme.PRIMARY_COLOR}]}>รายการสิ่งของ</Text></View>
                <View style={{marginBottom: 10}}>{itemsDisplay}</View>
              </View>
            </View>
            }
          </ScrollView>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15}}>
            <Button mode="contained" color={theme.COLOR_LIGHTGREY} dark={true} onPress={this._finishPost}>
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%", color: theme.FONT_SECONDARY_COLOR}}>สร้างใบเสนอราคาโปรด</Text>
            </Button>
          </View>
          <View style={{marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10}}>
            <Button mode="contained" color={theme.PRIMARY_COLOR} dark={true} onPress={this._goToQuotation}>
              <Text style={{fontSize: 18, textAlign: "center", fontFamily: theme.FONT_FAMILY, width: "80%"}}>สร้างใบเสนอราคาใหม่</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}