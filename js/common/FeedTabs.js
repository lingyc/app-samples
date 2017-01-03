import React, { Component } from 'react';
import { Text, Dimensions } from 'react-native';
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view';
import Feeds from './Feeds.js';
let screenWidth = Dimensions.get('window').width;


export default class FeedTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Feeds' },
        { key: '2', title: 'Photos' },
      ],
    };
  }

  _handleChangeTab = (index) => {
    this.setState({ index });
  };

  _renderHeader = (props) => {
    const indicatorWidth = 65;
    let marginleft = screenWidth / 4 - indicatorWidth / 2;
    return <TabBarTop {...props} style={{backgroundColor: 'white'}}
      labelStyle={{fontSize: 12, color: "grey"}}
      // labelHighligtedStyle={{fontSize: 12, color: "black"}}
      indicatorStyle={{backgroundColor: '#326fd1', alignSelf: 'center', marginLeft: marginleft, width: indicatorWidth}} />;
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <Feeds feeds={this.props.feeds} />;
    case '2':
      return <Text>Photo tab</Text>;
    default:
      return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={{flex: 0}}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}
