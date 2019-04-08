import React, {Component} from 'react';
import {View} from 'react-native';
import {Appbar} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import theme from '../styles/theme.style';

class NavBarRefun extends Component {
    
    constructor() {
      super();
    }

    onPressButton = () => { Actions[this.props.action].call() }

    render () {
        return (
            <View style={{ height:60 }}>
                <Appbar.Header 
                    style={{ 
                        textAlign: 'center', 
                        backgroundColor: theme.PRIMARY_COLOR 
                    }}>
                    <Appbar.Action 
                        icon="close" 
                        color={ theme.COLOR_WHITE } 
                        onPress={ this.onPressButton } />
                    <Appbar.Content 
                        title={ this.props.title }
                        color={ theme.COLOR_WHITE }
                        titleStyle={{ 
                            fontFamily: theme.FONT_FAMILY,
                            fontSize: theme.FONT_SIZE_HEADER, 
                            fontWeight: "bold"
                        }}
                    />
                </Appbar.Header>
            </View>
        )
    }
}

NavBarRefun.defaultProps = {
    action: 'home',
    title: '',
};

export default NavBarRefun