import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSearchSubmit, onCityChange }) => {

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Enter City Name"
                    placeholderTextColor={'#000'}
                    onChangeText={(text) => onCityChange(text)}
                    onSubmitEditing={onSearchSubmit}
                />

                <TouchableOpacity style={styles.btn} onPress={onSearchSubmit} >
                    <Ionicons name="md-search" size={32} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    outerContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        paddingTop: 6,
        backgroundColor: '#181819'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        height: 43,
        width: '75%',
        borderColor: '#777777',
        borderWidth: 1,
        borderRadius: 4,
    },
    btn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 42,
        paddingHorizontal: 4,
        borderLeftWidth: 2,
        borderLeftColor: '#777777',
    },
    textInput: {
        color: '#000',
        fontSize: 17,
        paddingLeft: 5
    }
});