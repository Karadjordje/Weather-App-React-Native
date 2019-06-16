import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { formattedToday } from '../utils';

const CurrentTime = () => {

	return (
		<Text
			style={styles.updateTime}
		>
			{formattedToday()}
		</Text>
	)
}

const styles = StyleSheet.create({
	updateTime: {
		color: '#fff',
		fontSize: 14,
	}
});

export default CurrentTime;