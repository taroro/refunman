import React, {Component} from 'react'
import {Text, View, ScrollView, TouchableOpacity, Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'
import { DateFormat } from '../helpers/DateFormat'
import firebase from 'react-native-firebase'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay';

export default class DealedList extends Component {
  constructor(props) {
    super(props)
    this.unsubscribeDealedList = null
    this.refQuotations = firebase.firestore().collection('quotation')
      //.where('refunman_id', '==', '2npz1Jm961SkAoP13PDS')
      .where('refunman_id', '==', 'qq8Ots5XZfoqYh4cRNcD')
      .where('status', '==', 2)

    this.state = {
      loading: true,
      quotations: [],
      //refunManId: '2npz1Jm961SkAoP13PDS',
      refunManId: 'qq8Ots5XZfoqYh4cRNcD',
    }
  }

  componentDidMount() {
    this.unsubscribeDealedList = this.refQuotations.onSnapshot(this._onQuotationsCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribeDealedList()
  }

  _onQuotationsCollectionUpdate = (quotationsSnapshot) => {
    this.setState({loading: true})
    var promises = [];
    quotationsSnapshot.forEach(quotation => {
      var quotationId = quotation.id
      var quotationData = quotation.data()
      var refPost = firebase.firestore().collection('post').doc(quotationData.post_id)
      promises.push(
        refPost.get().then((post) => {
          var postData = post.data()
          return {
            quotationId: quotationId,
            refunManId: quotationData.refunman_id,
            sentDatetime: quotationData.sent_datetime,
            quotationStatus: quotationData.status,
            postId: post.id,
            availableDatetime: postData.available_datetime,
            latitude: postData.latitude,
            longitude: postData.longitude,
            postDatetime: postData.post_datetime,
            postType: postData.post_type,
            refunMeId: postData.refunme_id,
            shortAddress: postData.short_address,
            fullAddress: postData.full_address,
          }
        })
      )
    })
    
    Promise.all(promises).then(quotations => {
      this.setState({
        quotations: quotations,
        loading: false
      })
    })
  }

  _goToDealDetail = (quotationId, postId) => {
    Actions.dealdetail({
      quotationId: quotationId.toString(),
      postId: postId.toString()
    })
  }

  render() {
    var quotationDisplayArray = this.state.quotations.map((quotation, key) => {
      var date = DateFormat(quotation.availableDatetime)
      var postDate = DateFormat(quotation.postDatetime)
      return (
        <TouchableOpacity key={quotation.quotationId} onPress={() => this._goToDealDetail(quotation.quotationId, quotation.postId)}>
          <View style={[styles.postList, {flexDirection: "column", elevation:(Platform.OS === 'ios'?0:2)}]}>
            <View style={{flex: 3, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}> 
                <View style={{flex: 2, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 5, height: '100%'}}>
                  <View><Icon name='chat-bubble-outline' size={40} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} /></View>
                  <Text style={[styles.textTiny, {color: theme.PRIMARY_COLOR, textAlign: 'center', width: '100%'}]}>พูดคุย</Text>
                </View>
                <View style={{borderLeftWidth: 2, borderLeftColor: theme.BACKGROUND_PRIMARY_COLOR, height: 95}} />
                <View style={{flex: 3, alignItems: 'center', justifyContent: 'center', width: '100%', marginLeft: 10}}>
                  <View style={{flexDirection: 'column', alignItems: 'center', backgroundColor: theme.PRIMARY_COLOR, padding: 5, width: '100%', borderRadius: 20}}>
                    <Text style={[styles.textHeader, {color: theme.COLOR_WHITE, textAlign: 'center'}]}>{date.dayFullText}</Text>
                    <Text style= {[styles.textLargest, {color: theme.COLOR_WHITE, textAlign: 'center', marginTop: -15, marginBottom: -10}]}>{date.dateNum}</Text>
                  </View>
                </View>
                <View style={{borderLeftWidth: 2, borderLeftColor: theme.BACKGROUND_PRIMARY_COLOR, height: 95, marginLeft: 10}} />
                <View style={{flex: 4, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10, paddingTop: 5}}>
                  <Text style={[styles.textHeader, {color: theme.COLOR_DARKGREY, textAlign: 'left'}]}>{date.monthShortText+' '+date.year}</Text>
                  <Text style={[styles.textLargest, {color: theme.PRIMARY_COLOR, textAlign: 'left', marginTop: -15}]}>{date.timeText}</Text>
                </View>
              </View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={[styles.textTiny]}>ประกาศ{postDate.today?"วันนี้":"เมื่อวัน"+postDate.dayFullText+" "+postDate.dateNum+" "+postDate.monthShortText+" "+postDate.year} {postDate.timeText+" น."}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={{flex: 1}}>
        <Spinner
          visible={this.state.loading}
          animation={'fade'}
          textContent={'รอสักครู่...'}
          textStyle={{color:theme.PRIMARY_COLOR, fontFamily: theme.FONT_FAMILY, fontSize: theme.FONT_SIZE_LARGE, fontWeight: "normal"}}
        />
        <ScrollView>
          <View style={{alignItems: 'stretch', justifyContent: 'center', padding: 10}}>
            {(quotationDisplayArray.length > 0 && !this.state.loading)?
              quotationDisplayArray
              :<Text style={[styles.textNormal, {width: '100%', padding:10, textAlign: 'center'}]}>ยังไม่มีรายการ</Text>
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}