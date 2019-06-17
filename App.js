import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { getApiData } from './utils';

import SearchBar from './components/SearchBar';

import AppNavigator from './navigation/AppNavigator';

import apiKeys from './apikeys';

const ipApi = 'http://api.ipstack.com/check';
const openWeatherApi = 'http://api.openweathermap.org/data/2.5/weather';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationName: 'Weather in your area',
            errorMessage: null,
            userSearch: null,
            dataError: null,
            userIpData: {},
            todayData: null,
            loading: true,
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        this.setState({ loading: true });
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        let locationService = await Location.hasServicesEnabledAsync();

        if (status !== 'granted' || !locationService) {
            const ipApiParams = {
                access_key: apiKeys.ipstack
            };

            getApiData(ipApi, ipApiParams)
                .then(data => {
                    console.log('ipApi data', data);
                    if (data.error) {
                        console.log('ima error');
                        this.setState({ dataError: data.error.info, loading: false });
                        return;
                    }

                    let { latitude, longitude } = data;
                    this.onAppLoad(latitude, longitude);
                });
        } else {
            let location = await Location.getCurrentPositionAsync({});
            console.log('location data from device', location);
            let { latitude, longitude } = location.coords;
            this.onAppLoad(latitude, longitude);
        }
    };

    onAppLoad = (lat, lon) => {
        const initialWeatherParams = {
            lat,
            lon,
            units: 'metric',
            mode: 'JSON',
            APPID: apiKeys.openWeather
        };

        getApiData(openWeatherApi, initialWeatherParams)
            .then(data => {
                console.log(data);
                if (data.error) {
                    this.setState({ dataError: data.error, loading: false });
                    return;
                }

                this.setState({
                    todayData: data,
                    loading: false,
                    dataError: null
                });
            });
    }

    searchSubmit = () => {
        const weatherParams = {
            q: this.state.userSearch,
            units: 'metric',
            mode: 'JSON',
            APPID: apiKeys.openWeather
        };

        this.setState({ loading: true });

        getApiData(openWeatherApi, weatherParams)
            .then(data => {
                if (data.error) {
                    Alert.alert(
                        'Bad request',
                        'There was on error with you request. Please try again!'
                    );
                    this.setState({ loading: false });
                    return;
                }

                let locationName = data.name;
                console.log('search submit');
                this.setState({
                    locationName,
                    todayData: data,
                    loading: false,
                });

            });
    }

    cityChange = (text) => {
        this.setState({
            userSearch: text
        });
    }

    render() {
        const { loading, todayData, errorMessage, dataError, locationName } = this.state;

        const screenProps = {
            locationName,
            todayData
        };

        if (errorMessage) {
            return (
                <View style={styles.loadingWrap}>
                    <Text style={styles.error}>{errorMessage}</Text>
                </View>
            );
        }

        if (dataError) {
            return (
                <View style={styles.loadingWrap}>
                    <Text style={styles.error}>{dataError}</Text>
                </View>
            );
        }

        if (loading) {
            return (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <SearchBar onCityChange={this.cityChange} onSearchSubmit={this.searchSubmit} />
                <AppNavigator screenProps={screenProps} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    loadingWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    error: {
        color: 'red',
        padding: 10
    }
});