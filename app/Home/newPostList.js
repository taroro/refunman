import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import geolib from 'geolib';
import firebase from 'react-native-firebase';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';

export default class NewPostList extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.refPost = firebase.firestore().collection('post').where("status", "==", 0);

    this.state = {
      loading: true,
      posts: [],
      latitude: null,
      longitude: null,
      error:null,
      region: null,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          },
        });
        this.unsubscribe = this.refPost.onSnapshot(this._onCollectionUpdate);
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  _onCollectionUpdate = (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      const {available_datetime, latitude, longitude, post_datetime, post_type, refunme_id} = doc.data();
      posts.push({
        key: doc.id,
        available_datetime,
        latitude,
        longitude,
        post_datetime,
        post_type,
        refunme_id
      });
    });
    this.setState({ 
      posts,
      loading: false,
    });
  }

  render() {
    if(this.state.loading) {
      return null; 
    }

    let postDisplayArray = this.state.posts.map((post, key) => {
      let distance = geolib.getDistance(
        {latitude: this.state.latitude, longitude:this.state.longitude},
        {latitude: post.latitude, longitude: post.longitude}
      );
      //console.warn(this.state.latitude+" "+post.latitude)
      return (
        <TouchableOpacity onPress={() => this._goToQuantitySelect(post.key)} key={"post"+key}>
          <View style={[styles.postList, {flexDirection:"column"}]} key={key}>
            <View style={{flex:2, flexDirection:"row"}}>
              <View style={{flex: 1, flexDirection:"column"}}>
                <Text style={[styles.textNormalGreen]}>{distance/1000}</Text>
                <Text style={[styles.textTiny, {color: theme.FONT_PRIMARY_COLOR, flexWrap:"wrap", justifyContent:"center"}]}>อ.เมือง จ.อุบลราชธานี</Text>
              </View>
              <View style={{flex: 1, flexDirection:"column"}}>
                <Text style={[styles.textNormalGreen]}>{distance/1000}</Text>
              </View>
              <View style={{flex: 1, flexDirection:"column"}}>
                <Text style={[styles.textNormalGreen]}>{distance/1000}</Text>
              </View>
            </View>
            <View style={{flex:1, alignItems:"center"}}><Text style={[styles.textTiny]}>ประกาศวันนี้</Text></View>
          
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={{flex: 1}}>
          <ScrollView>
            <View style={{alignItems:"stretch"}}>{postDisplayArray}</View>
          </ScrollView>
      </View>
    );
  }
}