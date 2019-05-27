import React, {Component} from 'react'
import {Text, View, ScrollView, TouchableOpacity, Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'
import geolib from 'geolib'
import { DistanceFormat } from '../helpers/DistanceFormat'
import { DateFormat } from '../helpers/DateFormat'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'

export default class NewPostList extends Component {
  constructor(props) {
    super(props)
    this.unsubscribeNewPostList = null
    this.refPost = firebase.firestore().collection('post').where('status', '==', 0)

    this.state = {
      loading: true,
      posts: [],
      refunManId: '2npz1Jm961SkAoP13PDS',
      //refunManId: 'qq8Ots5XZfoqYh4cRNcD',
      deviceLatitude: null,
      deviceLongitude: null,
      deviceLocationError: null,
    }
  }

  componentDidMount() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            deviceLocationError: null,
            deviceLatitude: position.coords.latitude,
            deviceLongitude: position.coords.longitude,
            loading: false,
          })
          this.unsubscribeNewPostList = this.refPost.onSnapshot(this._onPostCollectionUpdate)
        },
        (error) => {
          this.setState({
            deviceLocationError: error.message
          })
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000},
      )
    } else {
    }
  }

  componentWillUnmount() {
    this.unsubscribeNewPostList()
  }

  _onPostCollectionUpdate = (postsSnapshot) => {
    var promises = [];
    postsSnapshot.forEach(post => {
      var postId = post.id
      var postData = post.data()
      var refQuotation = firebase.firestore().collection('quotation')
        .where('refunman_id', '==', '2npz1Jm961SkAoP13PDS')
        //.where('refunman_id', '==', 'qq8Ots5XZfoqYh4cRNcD')
        .where('post_id', '==', postId)
      promises.push(
        refQuotation.get().then((doc) => {
          if (doc.size == 0) {
            return {
              key: post.id,
              availableDatetime: postData.available_datetime,
              latitude: postData.latitude,
              longitude: postData.longitude,
              postDatetime: postData.post_datetime,
              postType: postData.post_type,
              refunMeId: postData.refunme_id,
              shortAddress: postData.short_address,
              fullAddress: postData.full_address,
            }
          }
        })
      )
    })
    
    Promise.all(promises).then(newPosts => {
      var posts = [];
      newPosts.forEach(post => {
        if(post) { posts.push(post) }
      }) 
      this.setState({
          posts: posts,
          loading: false
      })
    })
  }

  _goToPostDetail = key => {
    Actions.postdetail({
      postId: key.toString()
    })
  }

  render() {
    if(this.state.loading) {
      return null
    }

    var postDisplayArray = this.state.posts.map((post, key) => {
      var distance = geolib.getDistance(
        {latitude: this.state.deviceLatitude, longitude: this.state.deviceLongitude},
        {latitude: post.latitude, longitude: post.longitude}
      )
      var date = DateFormat(post.availableDatetime)
      var postDate = DateFormat(post.postDatetime)
      var textDistance = DistanceFormat(distance)
      return (
        <TouchableOpacity key={post.key} onPress={() => this._goToPostDetail(post.key)}>
          <View style={[styles.postList, {flexDirection: "column", elevation:(Platform.OS === 'ios'?0:2)}]}>
            <View style={{flex: 3, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'flex-start'}}>
                <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: theme.PRIMARY_COLOR, paddingBottom: 0, width: '100%', borderRadius: 20}}>
                  <Text style={[styles.textLargest, {color: theme.COLOR_WHITE, textAlign: 'center', marginBottom:-15}]}>{textDistance}</Text>
                  <Text style= {[styles.textExtraLarge, {color: theme.COLOR_WHITE, textAlign: 'center'}]}>KM</Text>
                </View>
              </View>
              <View style={{borderLeftWidth: 2, borderLeftColor: theme.BACKGROUND_PRIMARY_COLOR, height: 95, marginLeft: 10, marginRight: 15}} />
              <View style={{flex: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
               <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <Text style={[styles.textExtraLarge, {color: theme.PRIMARY_COLOR, textAlign: 'left'}]}>วัน{date.dateShow}ที่ {date.dateNum}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: -5}}>
                  <Text style={[styles.textNormal, {color: theme.COLOR_DARKGREY, textAlign: 'center'}]}>{date.monthShortText+" "+date.year} เวลา {date.timeText} น.</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.textTiny, {color: theme.COLOR_DARKGREY, textAlign: 'left'}]}>{post.shortAddress}</Text>
                </View>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
              <Text style={[styles.textTiny]}>ประกาศ{postDate.today?"วันนี้":"เมื่อวัน"+postDate.dayFullText+" "+postDate.dateNum+" "+postDate.monthShortText+" "+postDate.year} {postDate.timeText+" น."}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{alignItems: 'stretch', justifyContent: 'center', padding: 10}}>
            {(postDisplayArray.length > 0 || !this.state.loading)?
              postDisplayArray
              :<Text style={[styles.textNormal, {width: '100%', padding:10, textAlign: 'center'}]}>ยังไม่มีประกาศใหม่</Text>
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}