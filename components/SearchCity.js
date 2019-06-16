import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const SearchCity = ({ onSearchSubmit, onCityChange }) => {

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder="Enter City Name"
                placeholderTextColor={'#e0e0e0'}
                onChangeText={(text) => onCityChange(text)}
            />

            <TouchableOpacity style={styles.btn} onPress={onSearchSubmit} >
                <Ionicons name="md-search" size={27} color="#e0e0e0" />
            </TouchableOpacity>
        </View>
    )
}

export default SearchCity;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        height: 40,
        width: '75%',
        borderColor: '#e0e0e0',
        borderWidth: 2,
        borderRadius: 3,
    },
    btn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 34,
        paddingHorizontal: 4,
        borderLeftWidth: 2,
        borderLeftColor: '#e0e0e0',
    },
    textInput: {
        color: '#e0e0e0',
        fontSize: 16,
        paddingLeft: 5
    }
})