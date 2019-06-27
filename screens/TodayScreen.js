import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    PanResponder,
    Animated
} from 'react-native';

import { capitalizeFirstLatter } from '../utils';

import Background from '../components/Background';
import CurrentTime from '../components/CurrentTime';

export default class TodayScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gestureY: new Animated.Value(125),
        };

        this._gestureY = 0;

        this.state.gestureY.addListener(({ value }) => {
            this._gestureY = value;
        });

        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                // Don't do anything on taps
                return Math.abs(gestureState.dx) > 1 && Math.abs(gestureState.dy) > 1;
            },
            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                // gestureState.d{x,y} will be set to zero now
                // console.log('onPanResponderGrant', gestureState);
                console.log(this.state.gestureY._value, this._gestureY);
                this.state.gestureY.setOffset(this._gestureY);
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
                // console.log('onPanResponderRelease', gestureState);
                // console.log('gestureState.dy', gestureState.dy);
                this.state.gestureY.flattenOffset();

                if (gestureState.dy < -75) {
                    Animated.spring(this.state.gestureY, {
                        toValue: -125,
                        useNativeDriver: true,
                    }).start();
                } else if (gestureState.dy > 75) {
                    Animated.spring(this.state.gestureY, {
                        toValue: 125,
                        useNativeDriver: true,
                    }).start();
                } else {
                    let originalPos;
                    if (gestureState.dy < 0) {
                        originalPos = 125;
                    } else {
                        originalPos = -125;
                    }

                    Animated.spring(this.state.gestureY, {
                        toValue: originalPos,
                        useNativeDriver: true,
                    }).start();
                }
            },
        });
    }

    render() {
        const {
            locationName,
            todayData,
        } = this.props.screenProps;

        let currentTemp = `${todayData.main.temp.toFixed(0)} °C`;
        let maxTemp = `${todayData.main.temp_max.toFixed(0)} °C`;
        let minTemp = `${todayData.main.temp_min.toFixed(0)} °C`;
        let humidity = `${todayData.main.humidity} %`;
        let pressure = `${todayData.main.pressure} hPa`;
        let cloudiness = `${todayData.clouds.all} %`;
        let windSpeed = `${todayData.wind.speed} m/s`;
        let windDirection = `${todayData.wind.deg} deg`;
        let icon = todayData.weather[0].icon;
        let weatherDesc = capitalizeFirstLatter(todayData.weather[0].description);
        let weatherIconSrc = `http://openweathermap.org/img/w/${icon}.png`;

        let translateY = this.state.gestureY.interpolate({
            inputRange: [-125, 125],
            outputRange: [0, 210],
            extrapolate: 'clamp'
        });

        let opacity = this.state.gestureY.interpolate({
            inputRange: [-125, 20],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });

        const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

        return (
            <Background
                city={locationName}
            >
                <View style={styles.container} {...this._panResponder.panHandlers}>
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
                        <Text style={styles.temp}>{currentTemp}</Text>
                    }

                    <CurrentTime />
                </View>

                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 3,
                        height: 210,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: [{ translateY }]
                    }}
                >
                    {
                        maxTemp &&
                        <Text style={styles.temp}>Max temperature: {maxTemp}</Text>
                    }

                    {
                        minTemp &&
                        <Text style={styles.temp}>Min temperature: {minTemp}</Text>
                    }

                    {
                        humidity &&
                        <Text style={styles.temp}>Humidity: {humidity}</Text>
                    }

                    {
                        pressure &&
                        <Text style={styles.temp}>Pressure: {pressure}</Text>
                    }

                    {
                        cloudiness &&
                        <Text style={styles.temp}>Cloudiness: {cloudiness}</Text>
                    }

                    {
                        windSpeed &&
                        <Text style={styles.temp}>Wind speed: {windSpeed}</Text>
                    }

                    {
                        windDirection &&
                        <Text style={styles.temp}>Wind direction: {windDirection}</Text>
                    }
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
                            toValue: -125,
                            speed: 2,
                            bounciness: 0,
                            useNativeDriver: true
                        }).start()
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

TodayScreen.navigationOptions = {
    header: null,
};

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