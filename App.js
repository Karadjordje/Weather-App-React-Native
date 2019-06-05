import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	KeyboardAvoidingView,
	TextInput,
	Image,
	TouchableOpacity,
	Alert,
	Keyboard,
	Platform,
	ActivityIndicator,
	PanResponder,
	Animated,
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { formattedToday, capitalizeFirstLatter, getApiData } from './utils';
import Background from './components/Background';
import apiKeys from './apikeys';

const ipApi = 'http://api.ipstack.com/check';
const openWeatherApi = 'http://api.openweathermap.org/data/2.5/weather';
const googleImgApi = 'https://www.googleapis.com/customsearch/v1';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			locationName: 'Weather in your area',
			errorMessage: null,
			userSearch: null,
			today: formattedToday(),
			weatherIconSrc: null,
			weatherDesc: null,
			currentTemp: null,
			dataError: false,
			userIpData: {},
			imgUrl: null,
			loading: false,
			gestureY: new Animated.Value(-125),
		}

		this._panResponder = PanResponder.create({
			// Ask to be the responder:
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
				// Don't do anything on taps
				return Math.abs(gestureState.dx) > 3 && Math.abs(gestureState.dy) > 3;
			},
			onPanResponderGrant: (evt, gestureState) => {
				// The gesture has started. Show visual feedback so the user knows
				// what is happening!
				// gestureState.d{x,y} will be set to zero now
				console.log('onPanResponderGrant', gestureState);
				this.state.gestureY.setOffset(this.state.gestureY._value);
				this.state.gestureY.setValue(0);
				console.log('gestureY on grant', this.state.gestureY);
			},
			// The most recent move distance is gestureState.move{X,Y}
			// The accumulated gesture distance since becoming responder is
			// gestureState.d{x,y}
			onPanResponderMove: Animated.event([
				null, { dy: this.state.gestureY },
			]),
			onPanResponderRelease: (evt, gestureState) => {
				// The user has released all touches while this view is the
				// responder. This typically means a gesture has succeeded
				console.log('onPanResponderRelease', gestureState);
				console.log('gestureState.dy', gestureState.dy);
				this.state.gestureY.flattenOffset();

				if (gestureState.dy < -50) {
					console.log('mannje');
					Animated.spring(this.state.gestureY, {
						toValue: -125,
						speed: 2,
						bounciness: 0,
						useNativeDriver: true,
					}).start(() => this.state.gestureY.setValue(-125));
					// this.state.gestureY.setValue(-125);
				} else if (gestureState.dy > 50) {
					console.log('vise');
					Animated.spring(this.state.gestureY, {
						toValue: 125,
						speed: 2,
						bounciness: 0,
						useNativeDriver: true
					}).start(() => this.state.gestureY.setValue(125));
					// this.state.gestureY.setValue(125);
				} else {
					console.log('vrati gde je bilo');
					let originalPos;
					if (gestureState.dy < 0){
						originalPos = 125
					} else {
						originalPos = -125
					}

					Animated.spring(this.state.gestureY, {
						toValue: originalPos,
						speed: 2,
						bounciness: 0,
						useNativeDriver: true
					}).start(() => this.state.gestureY.setValue(originalPos));
				}
				console.log('gestureY on release', this.state.gestureY);
			},
		});
	}

	componentDidMount() {
		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			});
		} else {
			this._getLocationAsync();
		}

		this.interval = setInterval(() => {
			this.setState({
				today: formattedToday()
			})
		}, 1000);
	}

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		let locationService = await Location.hasServicesEnabledAsync();

		if (status !== 'granted' || !locationService) {
			const ipApiParams = {
				access_key: apiKeys.ipstack
			}

			getApiData(ipApi, ipApiParams)
				.then(data => {
					console.log('ipApi data', data)
					let { lat, lon } = data;
					this.onAppLoad(lat, lon);
				});
		}

		let location = await Location.getCurrentPositionAsync({});
		console.log('location data from device', location);
		let {lat, lon} = location.coords;
		this.onAppLoad(lat, lon);
	};

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

		getApiData(openWeatherApi, initialWeatherParams).then(data => {
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

	onSearchSubmit = () => {
		const initialWeatherParams = {
			q: this.state.userSearch,
			units: 'metric',
			mode: 'JSON',
			APPID: apiKeys.openWeather
		}

		this.setState({ loading: true });

		getApiData(openWeatherApi, initialWeatherParams)
			.then(data => {
				if (data.error) {
					Alert.alert(
						'Bad request',
						'There was on error with you request. Please try again!'
						)
						this.setState({ loading: false });
						return;
					}

					let locationName = data.name;
					let currentTemp = data.main.temp.toFixed(0);
					let icon = data.weather[0].icon;
					let desc = capitalizeFirstLatter(data.weather[0].description);

					this.setState({
						locationName,
						currentTemp,
						weatherIconSrc: `http://openweathermap.org/img/w/${icon}.png`,
						weatherDesc: desc,
						loading: false,
					});

					Keyboard.dismiss();
				})
	}

	render() {
		const {
			errorMessage,
			weatherIconSrc,
			locationName,
			weatherDesc,
			currentTemp,
			loading,
		} = this.state;

		let translateY = this.state.gestureY.interpolate({
			inputRange: [-125, 125],
			outputRange: [200, 0],
			extrapolate: 'clamp'
		});

		let opacity = this.state.gestureY.interpolate({
			inputRange: [-125, 20],
			outputRange: [1, 0],
			extrapolate: 'clamp'
		});

		const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

		if (errorMessage) {
			return (
				<View style={styles.container}>
					<Text style={styles.name}>{errorMessage}</Text>
				</View>
			);
		}

		return (
			<Background
				city={locationName}
			>
				{loading ?
					<View style={styles.loadingWrap}>
						<ActivityIndicator size="large" color="white" />
					</View> : null
				}
				<KeyboardAvoidingView style={styles.container} behavior="padding" enabled {...this._panResponder.panHandlers}>
					{
						weatherIconSrc &&
						<Image
							source={{ uri: weatherIconSrc }}
							style={{ width: 80, height: 80 }}
						/>
					}

					{
						locationName &&
						<Text style={styles.name}>{locationName}</Text>
					}

					{
						weatherDesc &&
						<Text style={styles.type}>{weatherDesc}</Text>
					}

					{
						currentTemp &&
						<Text style={styles.temp}>{currentTemp} °C</Text>
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

				<Animated.View
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						zIndex: 3,
						height: 200,
						backgroundColor: 'black',
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						transform: [{ translateY }]
					}}
				>
					<Animated.Text
						style={{
							color: '#fff',
							fontSize: 30,
						}}
					>
						Title goes here
					</Animated.Text>
				</Animated.View>

				<AnimatedTouchable
					style={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						zIndex: 3,
						height: 50,
						backgroundColor: 'rgba(0,0,0,0.5)',
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						opacity
					}}
					onPress={
						() => Animated.spring(this.state.gestureY, {
							toValue: 125,
							speed: 2,
							bounciness: 0,
							useNativeDriver: true
						}).start(() => this.state.gestureY.setValue(125))
					}
				>
					<Animated.Text
						style={{
							color: '#fff',
							fontSize: 20,
						}}
					>
						More data
					</Animated.Text>
				</AnimatedTouchable>
			</Background>
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
	},
	loadingWrap: {
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	}
});
