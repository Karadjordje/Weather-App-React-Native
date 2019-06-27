import React from 'react';
import {
    View,
    Text,
    StyleSheet,
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
const forecastApi = 'http://api.openweathermap.org/data/2.5/forecast';

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
            dailyData: null,
            loading: true,
        };
    }

    componentDidMount() {
        this._getLocationAsync();
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
        console.log('on app load');
        const initialWeatherParams = {
            lat,
            lon,
            units: 'metric',
            mode: 'JSON',
            APPID: apiKeys.openWeather
        };

        Promise.all([
            getApiData(openWeatherApi, initialWeatherParams),
            getApiData(forecastApi, initialWeatherParams)
        ]).then(([todayData, dailyData]) => {
            if (todayData.error) {
                this.setState({ dataError: data.error, loading: false });
                return;
            }

            if (dailyData.error) {
                this.setState({ dataError: data.error, loading: false });
                return;
            }

            this.setState({
                todayData: todayData,
                dailyData: dailyData,
                loading: false,
                dataError: null
            });
        }).catch(err => {
            this.setState({ dataError: err.error, loading: false });
        });

        // getApiData(openWeatherApi, initialWeatherParams)
        //     .then(data => {
        //         if (data.error) {
        //             this.setState({ dataError: data.error, loading: false });
        //             return;
        //         }

        //         this.setState({
        //             todayData: data,
        //             loading: false,
        //             dataError: null
        //         });
        //     });

        // getApiData(forecastApi, initialWeatherParams)
        //     .then(data => {
        //         if (data.error) {
        //             this.setState({ dataError: data.error, loading: false });
        //             return;
        //         }

        //         this.setState({
        //             dailyData: data,
        //             loading: false,
        //             dataError: null
        //         });
        //     });
    }

    searchSubmit = () => {
        this.setState({ loading: true });

        const weatherParams = {
            q: this.state.userSearch,
            units: 'metric',
            mode: 'JSON',
            APPID: apiKeys.openWeather
        };

        Promise.all([
            getApiData(openWeatherApi, weatherParams),
            getApiData(forecastApi, weatherParams)
        ]).then(([todayData, dailyData]) => {
            if (todayData.error) {
                Alert.alert(
                    'Bad request',
                    'There was on error with you request. Please try again!'
                );
                this.setState({ loading: false });
                return;
            }

            if (dailyData.error) {
                Alert.alert(
                    'Bad request',
                    'There was on error with you request. Please try again!'
                );
                this.setState({ loading: false });
                return;
            }

            let locationName = todayData.name;

            this.setState({
                locationName,
                todayData: todayData,
                dailyData: dailyData,
                loading: false,
                dataError: null
            });
        }).catch(err => {
            this.setState({ dataError: err.error, loading: false });
        });


        // getApiData(openWeatherApi, weatherParams)
        //     .then(data => {
        //         if (data.error) {
        //             Alert.alert(
        //                 'Bad request',
        //                 'There was on error with you request. Please try again!'
        //             );
        //             this.setState({ loading: false });
        //             return;
        //         }

        //         let locationName = data.name;
        //         console.log('search submit');
        //         this.setState({
        //             locationName,
        //             todayData: data,
        //             loading: false,
        //         });

        //     });

        // getApiData(forecastApi, weatherParams)
        //     .then(data => {
        //         if (data.error) {
        //             Alert.alert(
        //                 'Bad request',
        //                 'There was on error with you request. Please try again!'
        //             );
        //             this.setState({ loading: false });
        //             return;
        //         }

        //         this.setState({
        //             dailyData: data,
        //             loading: false,
        //         });

        //     });
    }

    cityChange = (text) => {
        this.setState({
            userSearch: text
        });
    }

    render() {
        const { loading, todayData, dailyData, errorMessage, dataError, locationName } = this.state;
        console.log(loading);

        const screenProps = {
            locationName,
            todayData,
            dailyData
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