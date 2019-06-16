import {
    createStackNavigator,
    createMaterialTopTabNavigator,
} from 'react-navigation';

import TodayScreen from '../screens/TodayScreen';
import DailyScreen from '../screens/DailyScreen';

const TodayStack = createStackNavigator({
    Today: TodayScreen,
});

TodayStack.navigationOptions = {
    tabBarLabel: 'Today'
};

const DailyStack = createStackNavigator({
    Daily: DailyScreen,
});

DailyStack.navigationOptions = {
    tabBarLabel: 'Daily'
};

export default createMaterialTopTabNavigator({
    TodayStack,
    DailyStack,
}, {
    tabBarOptions: {
        style: {
            backgroundColor: '#181819',
        },
        indicatorStyle: {
            backgroundColor: 'white',
            height: 3
        }
    }
});
