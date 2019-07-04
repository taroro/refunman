import React, {Component} from 'react'
import {Text, View, Platform} from 'react-native'
import {Button, Divider} from 'react-native-paper'
import {Actions} from 'react-native-router-flux'
import theme from '../styles/theme.style'
import styles from '../styles/component.style'

export default class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemArray: [],
      totalAll: 0
    }
    this.indexItem = 0;
  }
  
  _goToSelectCate = () => { 
    Actions.categoryreceipt({
      onPop: this._goToQuantitySelect.bind(this)
    }) 
  }

  _goToQuantitySelect = (category) => {
    Actions.quantityreceipt({
      onPop: this._goToPriceSelect.bind(this),
      category: category
    })
  }

  _goToPriceSelect = (data) => {
    Actions.pricereceipt({
      onPop: this._insertItem.bind(this), 
      data: data,
    })
  }

  _insertItem = (itemData) => {
    this.setState({
      itemArray: [...this.state.itemArray, itemData]
    }, () => { 
      this.props._updateItemDataToParent(this.state.itemArray); 
    })
    this.indexItem = this.indexItem+1
  }

  render() {
    var totalAll = 0
    let itemDisplayArray = this.state.itemArray.map((item, key) => {
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
    
    return(
      <View style={{alignItems: 'stretch', flex: 1, flexDirection: 'column', justifyContent: 'flex-start', width: '100%'}}>
        <View style={{marginTop:20, marginLeft:15, marginRight:15}}>
          <View>
          <Text style={[styles.textExtraLarge, {paddingLeft:15, paddingTop: 10, color:theme.PRIMARY_COLOR}]}>รายการรับซื้อ</Text>
          </View>
        </View>
        <View style={{marginTop:20, marginLeft:15, marginRight:15, flexDirection: "row"}}>
          <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>ยอดรวม</Text>
          <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_RED}]}>{totalAll.toFixed(2)}</Text>
          <Text style={[styles.textExtraLarge, {paddingLeft:15, color:theme.COLOR_DARKGREY}]}>บาท</Text>
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
            <View style={{flex:1, justifyContent:'center', alignItems:'center', marginTop:20, marginBottom:20}}>
              <Button mode='contained' color={theme.SECONDARY_COLOR} dark={true} onPress={this._goToSelectCate} style={{width:'60%'}}>
                <Text style={[styles.textNormal]}>เพิ่มรายการ</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    )
  }
}