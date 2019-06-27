import React from 'React';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { colorSwitch } from '../constants/colors';

const BarGraph = ({ dailyData, date }) => {
    console.log('dailyData', dailyData);
    const barWidth = 100 / dailyData.length;

    return (
        <View style={styles.chartContainer}>
            <Text>{date}</Text>
            <View style={styles.middleLine} />
            {
                dailyData.map((item, i) => {
                    let left = i * barWidth;
                    const currentTemp = item.main.temp;
                    const tempColor = colorSwitch(currentTemp);

                    return(
                        <View
                            style={{
                                position: 'absolute',
                                top: `${50 - currentTemp}%`,
                                left: `${left}%`,
                                height: `${currentTemp}%`,
                                width: `${barWidth}%`,
                                backgroundColor: `${tempColor}`,
                            }}
                            key={item.dt}
                        >
                            <Text style={{textAlign: 'center', color: '#fff'}}>
                                {Math.round(currentTemp)}°
                            </Text>
                        </View>
                    );
                })
            }
        </View>
    );
};

export default BarGraph;

const styles = StyleSheet.create({
    chartContainer: {
        position: 'relative',
        width: '100%',
        height: 220,
        borderWidth: 2,
        borderColor: '#333',
        marginBottom: 5
    },
    middleLine: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#333',
    }
});