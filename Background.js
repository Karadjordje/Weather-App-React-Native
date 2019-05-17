import React from 'react';
import {
	View,
	ImageBackground,
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
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

import defaultImage from './assets/uvac.jpg';
const googleImgApi = 'https://www.googleapis.com/customsearch/v1';

class Background extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            imgUrl: null,
            error: null,
		}
    }

    componentDidUpdate(prevProps) {
        if (prevProps.city !== this.props.city) {
            this.imageSearch(this.props.city);
        }
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
        this.setState({ error: null, loading: true });
		getApiData(googleImgApi, imageParams)
			.then(data => {
                if (data.error) {
                    this.setState({
                        error: true,
                        loading: false,
                    });
                    return;
                }
				let imgUrl = data.items[0].link;
				this.setState({
                    imgUrl,
                    error: false,
                    loading: false,
				});
			})
	}

	render() {
		const {
            imgUrl,
            loading,
            error,
        } = this.state;
        const {
            children,
        } = this.props;
        if (loading || error) {
            return (<View style={{ backgroundColor: 'black', width: '100%', height: '100%', flex: 1 }}>
                {children}
            </View>);
        }
		return (
			<ImageBackground
				source={imgUrl ? { uri: imgUrl } : defaultImage}
                style={{ width: '100%', height: '100%', flex: 1 }}
                onError={() => this.setState({ error: true })}
                defaultSource={require('./assets/dark.jpg')}
			>
				{children}
			</ImageBackground>
		);
	}
}

export default Background;
