import React, {Component} from 'react';
import {Text, View, SafeAreaView, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import firebase from 'react-native-firebase'
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';
import NavBarRefun from '../components/NavBarRefun';

export default class QuantitySelect extends Component {
  constructor(props) {
    super(props);
    this.refCategory = firebase.firestore().collection('waste_category');
    this.state = {
      mainCateIcon: 'hourglass',
      subCateTitle: '',
      subCateUnit: '',
      itemQuantity: '',
      mainCateDocId: '',
      subCateDocId: ''
    };
  }

  componentDidMount() {
    const mainCateDocId = this.props.category.selectedCategory;
    const subCateDocId = this.props.category.selectedSubCate;
    this.refCategory.doc(mainCateDocId).get().then((doc) => {
      const { icon } = doc.data();
      this.setState({
        mainCateIcon: icon
      })
    });
    this.refCategory.doc(mainCateDocId).collection('sub_category').doc(subCateDocId).get().then((doc) => {
      const { name_th, unit } = doc.data();
      this.setState({
        subCateTitle: name_th,
        subCateUnit: unit,
        mainCateDocId: mainCateDocId,
        subCateDocId: subCateDocId
      })
    });
  }
  
  componentWillUnmount() {
    this.props.onPop({
      itemData: {
        icon: this.state.mainCateIcon,
        cateTitle: this.state.subCateTitle,
        mainCate: this.state.mainCateDocId,
        subCate: this.state.subCateDocId,
        quantity: this.state.itemQuantity,
        unit: this.state.subCateUnit
      }
    });
  }

  returnData = () => {
    Actions.pop()
  }

  render () {
    const mainCateIcon = this.state.mainCateIcon
    const subCateTitle = this.state.subCateTitle
    const subCateUnit = this.state.subCateUnit

    return (
      <SafeAreaView style={[styles.container]} forceInset={{top:"always"}}>
        <NavBarRefun title="REFUN MAN" action="home" />
        <View style={[styles.postContainer]}>
          <View style={[styles.postStep]}>
            <Text style={[styles.textHeader]}>ระบุราคาของรายการ</Text>
          </View>
        </View>
        <View style={{width: "100%",height: 100}}>
          <View style={{flex:1, justifyContent: "center", alignItems: "center", marginLeft:5, marginRight:5, flexDirection:'row'}}>
            <View>
              <Icon name={mainCateIcon} size={45} backgroundColor={theme.COLOR_WHITE} color={theme.PRIMARY_COLOR} />
            </View>
            <View style={{marginLeft:20}}>
              <Text style={[styles.textHeader]}>{subCateTitle}</Text>
            </View>
          </View>
        </View>
        <View style={{width: "100%",height: 100}}>
          <View style={{flex:1, justifyContent: "center", alignItems: "center", marginLeft:5, marginRight:5, flexDirection:'row'}}>
            <View style={{}}>
              <Text style={[styles.textNormal]}>ระบุราคา</Text>
            </View>
            <View style={{marginLeft:20}}>
              <TextInput
                style={{height:40, borderRadius:10, width:100, backgroundColor: theme.COLOR_WHITE, paddingLeft:10, paddingRight:10,}}
                onChangeText={(itemQuantity) => this.setState({itemQuantity})}
                value={this.state.itemQuantity}
                keyboardType='decimal-pad'
                autoFocus
              />
            </View>
            <View style={{marginLeft:20}}>
              <Text style={[styles.textNormal]}>บาท/{subCateUnit}</Text>
            </View>
          </View>
        </View>
        <View style={{marginTop:10, marginLeft:15, marginRight:15, marginBottom:10}}>
            <Button mode="contained" color={theme.PRIMARY_COLOR} dark={true} onPress={this.returnData}>
              <Text style={{fontSize:18, textAlign:"center", fontFamily:theme.FONT_FAMILY, width: "80%"}}>ต่อไป</Text>
            </Button>
          </View>
      </SafeAreaView>
    )
  }
}