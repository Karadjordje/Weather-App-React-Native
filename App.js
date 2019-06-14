import React from 'react';
import { StyleSheet,View } from 'react-native';
import { Constants } from 'expo';

import AppNavigator from './navigation/AppNavigator';

export default function App() {
	console.log('Constants.statusBarHeight', Constants.statusBarHeight);
	return (
		<View style={styles.container}>
			<AppNavigator />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Constants.statusBarHeight,
	}
});