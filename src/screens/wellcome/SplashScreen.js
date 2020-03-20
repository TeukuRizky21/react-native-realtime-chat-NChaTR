import React, { Component } from 'react'
import {
    Text,
    View,
    StatusBar,
    StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import {firebase} from '../../config/firebase'

class SplashScreen extends Component {
    componentDidMount() {
        const { currentUser } = firebase.auth()
        setTimeout(() => {
            if (currentUser === null) {
                this.props.navigation.navigate('Login')
            }else {
                this.props.navigation.navigate('Chat')
            }
        }, 2000)
    }

    render() {
        return (
            <>
                <StatusBar hidden/>
                <View style={styles.root}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1.5, y: 0 }}
                        colors={['#757EE3', '#A972F4']}>
                        <View style={styles.header}>
                            <Text style={styles.text}>NChaTR</Text>
                            <Icon name="wind" size={22} color="#fff" />
                        </View>
                    </LinearGradient>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        marginTop: 20,
        fontSize: 40,
        color: '#fff',
        fontFamily: 'Holaholo'
    },
    header: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row'
    },
    textHeader: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Holaholo'
    }
})

export default SplashScreen