import React, {Component} from 'react';
import {Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
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
      posts: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.refPost.onSnapshot(this._onCollectionUpdate) 
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
      return (
        <TouchableOpacity onPress={() => this._goToQuantitySelect(post.key)} key={"post"+key}>
          <View style={[styles.postList]} key={key}><Text style={[styles.textNormalGreen]}>{post.latitude}</Text></View>
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