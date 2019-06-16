import React from 'React';
import {
    View,
    StyleSheet,
    Text,
    Platform,
} from 'react-native';

import { Constants, Location, Permissions } from 'expo';
import { capitalizeFirstLatter, getApiData } from '../utils';

import apiKeys from '../apikeys';

const ipApi = 'http://api.ipstack.com/check';
const openWeatherApi = 'http://api.openweathermap.org/data/2.5/forecast';

export default class DailyScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null
        };
    }

    // componentDidMount() {
    // 	if (Platform.OS === 'android' && !Constants.isDevice) {
    // 		this.setState({
    // 			errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
    // 		});
    // 	} else {
    // 		this._getLocationAsync();
    // 	}
    // }

    // _getLocationAsync = async () => {
    // 	let { status } = await Permissions.askAsync(Permissions.LOCATION);
    // 	let locationService = await Location.hasServicesEnabledAsync();

    // 	if (status !== 'granted' || !locationService) {
    // 		const ipApiParams = {
    // 			access_key: apiKeys.ipstack
    // 		}

    // 		getApiData(ipApi, ipApiParams)
    // 			.then(data => {
    // 				console.log('ipApi data', data)
    // 				let { lat, lon } = data;
    // 				this.onAppLoad(lat, lon);
    // 			});
    // 	} else {
    // 		let location = await Location.getCurrentPositionAsync({});
    // 		console.log('location data from device', location);
    // 		let { latitude, longitude } = location.coords;
    // 		this.onAppLoad(latitude, longitude);
    // 	}
    // };

    // onAppLoad = (lat, lon) => {
    // 	const initialWeatherParams = {
    // 		lat,
    // 		lon,
    // 		units: 'metric',
    // 		mode: 'JSON',
    // 		APPID: apiKeys.openWeather
    // 	}

    // 	getApiData(openWeatherApi, initialWeatherParams).then(data => {
    // 		console.log('daily data', data);
    // 	})
    // }

    render() {
        return (
            <Text>
                Test
            </Text>
        );
    }
}

DailyScreen.navigationOptions = {
    header: null,
};