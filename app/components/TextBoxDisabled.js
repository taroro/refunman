import React, { Component } from 'react';
import { Text, View, } from 'react-native';
import theme from '../styles/theme.style';
import styles from '../styles/component.style';

export default class TextBoxDisabled extends Component {
    constructor() {
      super();
    }

    render () {
        return (
            <View style={{ 
                backgroundColor:theme.BACKGROUND_PRIMARY_COLOR, 
                borderRadius:10, 
                height:40, 
                justifyContent:'center', 
                paddingLeft:10, 
                paddingRight:10,
                width:"100%", 
              }}>
                <Text style={[ styles.textNormal ]}>{ this.props.title }</Text>
            </View>
        )
    }
}