import React, { Component } from 'react';
import {Dimensions} from 'react-native';
import {FitlyBlue} from '../styles/styles.js'
import Carousel from 'react-native-looped-carousel';
import { push } from '../actions/navigation.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const { width, height } = Dimensions.get('window');

class OnBoadingSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: { width, height },
    };
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  render() {
    return (
      <View style={{ flex: 1 }} onLayout={this._onLayoutDidChange}>
        <Carousel
          style={this.state.size}
          bullets={true}
          onAnimateNextPage={(p) => console.log(p)}
        >
          <Slide
            image={require('../../img/slide01.png')}
            text={'Personalize Fitly to meet your fitness goals with exlusive workouts and fitness tips uploaded daily.'}
          />
          <Slide
            image={require('../../img/slide02.png')}
            text={'Find people in your area that share common fitness goals. Meetup to workout and motivate each other.'}
          />
          <Slide
            image={require('../../img/slide03.png')}
            text={'Discover activities and events around you to keep it sporty and social.'}
          />
          <Slide
            image={require('../../img/slide04.png')}
            text={'Track your progress and push each other to take it to the next level.'}
          />
        </Carousel>
      </View>
    );
  }
}

const Slide = (props) => {
  return (
    <View style={{flex: 1}}>
      <Image
        style={{flex: 2}}
        source={{uri: props.image}}
        defaultSource={require('../../img/default-photo-image.png')}/>
      <View style={{flex: 1, backgroundColor: FitlyBlue}}>
        <Text style={{color: 'white'}}>{props.text}</Text>
      </View>
    </View>
  );
};

const mapDispatchToProps = function(dispatch) {
 return {
   action: bindActionCreators({ printError, clearError, storeUserProfile }, dispatch),
   navigation: bindActionCreators({ push, resetTo }, dispatch)
 };
}

 export default connect(() => { return {} }, mapDispatchToProps)(OnBoadingSlides);
