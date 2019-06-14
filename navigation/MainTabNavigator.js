import {
    createStackNavigator,
    createMaterialTopTabNavigator,
} from 'react-navigation';

import TodayScreen from '../screens/TodayScreen';

const TodayStack = createStackNavigator({
    Today: TodayScreen,
});

TodayStack.navigationOptions = {
    tabBarLabel: 'Today'
};

const Test = createStackNavigator({
    Today: TodayScreen,
});

Test.navigationOptions = {
    tabBarLabel: 'Test'
};

export default createMaterialTopTabNavigator({
    TodayStack,
    Test,
});
