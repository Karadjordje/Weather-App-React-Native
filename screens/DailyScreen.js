import React from 'React';
import {
    StyleSheet,
    ScrollView,
    View,
} from 'react-native';

import BarGraph from '../components/BarGraph';

import { convertSecToDate, groupArrBy } from '../utils';

export default class DailyScreen extends React.Component {

    render() {
        const {
            dailyData,
        } = this.props.screenProps;

        const today = new Date();
        const todayDate = today.toLocaleDateString();

        let dataWithoutToday = dailyData.list.filter((forecast) => {
            return convertSecToDate(forecast.dt) !== todayDate;
        });

        let dataWithDate = dataWithoutToday.map(item => {
            item.date = convertSecToDate(item.dt);
            return item;
        });

        let groupedData = groupArrBy('date', dataWithDate);

        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        Object.keys(groupedData).map(item => {
                            console.log('item', item);
                            const dailyData = groupedData[item];
                            return (
                                <BarGraph key={item} dailyData={dailyData} date={item} />
                            );
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

DailyScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
});