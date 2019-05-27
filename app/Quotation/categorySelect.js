import React, {Component} from 'react';
import {Text, View, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';

export default class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.refCategory = firebase.firestore().collection('waste_category').orderBy("name_th");

    this.state = {
      loading: true,
      categories: [],
      subCategories: [],
      selectedCategory: "fav",
      selectedSubCate: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.refCategory.onSnapshot(this._onCollectionUpdate) 
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.props.onPop({
      selectedCategory: this.state.selectedCategory,
      selectedSubCate: this.state.selectedSubCate
    });
  }

  _goToQuantitySelect = event => {
    this.setState({
      selectedSubCate: event.toString()
    })
    Actions.pop();
  }

  _onCollectionUpdate = (querySnapshot) => {
    const categories = [];
    querySnapshot.forEach((doc) => {
      const {name_th, icon} = doc.data();
      categories.push({
        key: doc.id,
        doc,
        title: name_th,
        icon
      });
    });
    this.setState({ 
      categories,
      loading: false,
    });
  }

  _onSubCollectionUpdate = (querySnapshot) => {
    const subCategories = [];
    querySnapshot.forEach((doc) => {
      const {name_th} = doc.data();
      subCategories.push({
        key: doc.id,
        doc,
        title: name_th,
      });
    });
    this.setState({ 
      subCategories,
      loading: false,
    });
  }

  _getSubCate = event => {
    this.setState({
      selectedCategory: event.toString()
    })
    firebase.firestore().collection('waste_category').doc(event).collection("sub_category").orderBy("name_th").onSnapshot(this._onSubCollectionUpdate)
  }

  render() {
    const selectedCategory = this.state.selectedCategory;

    if(this.state.loading) {
      return null; 
    }

    let subCateDisplayArray = this.state.subCategories.map((item, key) => {
      return (
        <TouchableOpacity onPress={() => this._goToQuantitySelect(item.key)} key={"subCate"+key}>
          <View style={[styles.categoryNormalBox]} key={key}><Text style={[styles.textNormalGreen]}>{item.title}</Text></View>
        </TouchableOpacity>
      )
    })

    let mainCateDisplayArray = this.state.categories.map((item, key) => {
      return (
        <TouchableOpacity onPress={() => this._getSubCate(item.key)} key={key}>
          <View>
            <View style={{
              backgroundColor: theme.BACKGROUND_SECONDARY_COLOR,
              width: 60,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 5,
              marginRight: 5,
            }}>
              <Icon
                name={item.icon}
                size={35}
                backgroundColor={theme.COLOR_WHITE}
                color={selectedCategory===item.key?theme.PRIMARY_COLOR:theme.SECONDARY_COLOR} />
              <Text style={[styles.textTiny]}>{item.title}</Text>
            </View>
            <View style={{borderLeftWidth: 1, borderLeftColor: theme.FONT_PRIMARY_COLOR}} />
          </View>
        </TouchableOpacity>
      );
    });

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top: "always"}}>
        <NavBarRefun title="REFUN MAN" action="home" />
        <View style={[styles.postContainer]}>
          <View style={[styles.postStep]}>
            <ScrollView style={{height: 80, width: "100%", backgroundColor: theme.BACKGROUND_SECONDARY_COLOR, padding: 5}} horizontal >
              <TouchableOpacity onPress={() => this._getSubCate("fav", )} key="fav">
                <View>
                  <View style={{
                    backgroundColor: theme.BACKGROUND_SECONDARY_COLOR,
                    width: 80,
                    height: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 5,
                    marginRight: 5,
                  }}>
                    <Icon
                      name="star"
                      size={35}
                      backgroundColor={theme.COLOR_WHITE}
                      color={selectedCategory==="fav"?theme.PRIMARY_COLOR:theme.SECONDARY_COLOR} />
                    <Text style={[styles.textTiny]}>รายการโปรด</Text>
                  </View>
                  <View style={{borderLeftWidth: 1, borderLeftColor: theme.FONT_PRIMARY_COLOR}} />
                </View>
              </TouchableOpacity>
              {mainCateDisplayArray}
            </ScrollView>
          </View>
        </View>
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}}>
            <View style={[styles.postCateContainer]}>
              {subCateDisplayArray}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}