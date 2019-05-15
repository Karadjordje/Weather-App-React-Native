import React from 'react';
import {
	StyleSheet,
	Text,
	KeyboardAvoidingView,
	TextInput,
	ImageBackground,
	Image,
	TouchableOpacity,
	Alert,
	Keyboard,
} from 'react-native';
import { formattedToday, capitalizeFirstLatter, getApiData } from './utils';

import apiKeys from './apikeys';

const options = {
	weekday: 'short',
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
};

import defaultImage from './assets/uvac.jpg'

const ipApi = 'http://api.ipstack.com/check';
const openWeatherApi = 'http://api.openweathermap.org/data/2.5/weather';
const googleImgApi = 'https://www.googleapis.com/customsearch/v1';


export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			location: 'Weather in your area',
			userSearch: null,
			today: new Date().toLocaleDateString('sr-Latn-RS', options),
			weatherIconSrc: null,
			weatherDesc: null,
			currentTemp: null,
			dataError: false,
			userIpData: {},
			imgUrl: 'https://scontent-sin6-2.cdninstagram.com/vp/04837b8add6b2149a69dd0d89f0e70b8/5CF09871/t51.2885-15/e35/51353012_249238765964593_114478685069351006_n.jpg?_nc_ht=scontent-sin6-2.cdninstagram.com'
		}
	}

	componentDidMount() {
		const ipApiParams = {
			access_key: apiKeys.ipstack
		}

		getApiData(ipApi, ipApiParams)
			.then(data => {
				console.log('metoda neka', data)
				let lat = data.latitude;
				let lon = data.longitude;
				this.onAppLoad(lat, lon);
			});

		this.interval = setInterval(() => {
			this.setState({
				today: new Date().toLocaleDateString('sr-Latn-RS', options)
			})
		}, 1000);
	}

	showHideLoader = (loading) => {
		if (loading) {
			this.setState({
				loading: true
			});
		} else {
			this.setState({
				loading: false
			});
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	onAppLoad = (lat, lon) => {
		const initialWeatherParams = {
			lat,
			lon,
			units: 'metric',
			mode: 'JSON',
			APPID: apiKeys.openWeather
		}

		getApiData(openWeatherApi, initialWeatherParams)
			.then(data => {
				console.log(data);
				let currentTemp = data.main.temp.toFixed(0);
				let icon = data.weather[0].icon;
				let desc = capitalizeFirstLatter(data.weather[0].description);
				this.setState({
					currentTemp,
					weatherIconSrc: `http://openweathermap.org/img/w/${icon}.png`,
					weatherDesc: desc
				});
			})
	}

	imageSearch = (city) => {
		const imageParams = {
			q: city,
			num: 1,
			imgSize: 'xlarge',
			searchType: 'image',
			key: apiKeys.googleSearch,
			cx: apiKeys.googleCx
		}

		getApiData(googleImgApi, imageParams)
			.then(data => {
				console.log('google podaci za sliku', data);
				let imgUrl = data.items[0].link
				this.setState({
					imgUrl
				});
			})
	}

	onSearchSubmit = () => {
		const initialWeatherParams = {
			q: this.state.userSearch,
			units: 'metric',
			mode: 'JSON',
			APPID: apiKeys.openWeather
		}

		getApiData(openWeatherApi, initialWeatherParams)
			.then(data => {
				if(data.error) {
					Alert.alert(
						'Bad request',
						'There was on error with you request. Please try again!'					)
				}

				let location = data.name;
				let currentTemp = data.main.temp.toFixed(0);
				let icon = data.weather[0].icon;
				let desc = capitalizeFirstLatter(data.weather[0].description);
				this.imageSearch(location);

				this.setState({
					location,
					currentTemp,
					weatherIconSrc: `http://openweathermap.org/img/w/${icon}.png`,
					weatherDesc: desc
				});

				Keyboard.dismiss();
			})
	}

	render() {
		return (
			<ImageBackground
				source={{
					uri: this.state.imgUrl
				}}
				style={{width: '100%', height:'100%'}}
			>
				<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
					{
						this.state.weatherIconSrc &&
							<Image
								source={{ uri: this.state.weatherIconSrc }}
								style={{ width: 80, height: 80 }}
							/>
					}

					{
						this.state.location &&
						<Text style={styles.name}>{this.state.location}</Text>
					}

					{
						this.state.weatherDesc &&
						<Text style={styles.type}>{this.state.weatherDesc}</Text>
					}

					{
						this.state.currentTemp &&
						<Text style={styles.temp}>{this.state.currentTemp} °C</Text>
					}

					<TextInput
						style={styles.customInput}
						placeholder="Enter City Name"
						onChangeText={(text) => this.setState({
							userSearch: text
						})}
					/>

					<TouchableOpacity style={styles.btn} onPress={this.onSearchSubmit}>
						<Text style={styles.btnText}>Search</Text>
					</TouchableOpacity>

					<Text
						style={styles.updateTime}
					>
						{this.state.today}
					</Text>
				</KeyboardAvoidingView>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	name: {
		color: '#fff',
		fontSize: 22,
		marginBottom: 5,
	},
	type: {
		color: '#fff',
		fontSize: 18,
		marginBottom: 5,
	},
	temp: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 5,
	},
	updateTime: {
		color: '#fff',
		fontSize: 14,
	},
	customInput: {
		color: '#fff',
		height: 35,
		width: 150,
		paddingLeft: 6,
		marginTop: 20,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#fff',
		borderRadius: 3
	},
	btn: {
		backgroundColor: '#fff',
		borderRadius: 3,
		paddingVertical: 7,
		paddingHorizontal: 15,
		marginBottom: 20
	},
	btnText: {
		color: '#000',
		fontSize: 18,
		fontWeight: 'bold'
	}
});
