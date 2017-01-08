import React, {Component} from 'react';
import { Modal } from 'react-native';
import CommentsView from './CommentsView.js';
import ParentView from './ParentView.js';

export default class CommentsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeStack: [this.props.initialRoute],
    };

    // let route = {
    //   contentType: 'type',
    //   contentID: 'ID',
    //   parentAuthor: 'uID',
    // }

    // this.props.modalVisible;
    // this.props.renderParent;
    // this.props.closeModal
    // this.props.initialRoute;
  }

  _pushRoute(route) {
    let newRoutes = this.state.routeStack.slice();
    newRoutes.push(route);
    this.setState({routeStack: newRoutes});
  };

  _popRoute() {
    if (this.state.routeStack.length > 1) {
      let newRoutes = this.state.routeStack.slice();
      newRoutes.pop();
      this.setState({routeStack: newRoutes});
    } else {
      this.props.closeModal();
    }
  };

  _renderParent(latestRoute) {
    return (latestRoute) ? <ParentView route={latestRoute}/> : this.props.renderParent();
  };

  _renderChild(latestRoute) {
    return <CommentsView route={latestRoute} pushRoute={this._pushRoute.bind(this)}/>;
  };

  render() {
    const latestRoute = this.state.routeStack[this.state.routeStack.length - 1];
    return (
      <View>
        <Modal
          animationType={"fade"}
          transparent={false}
          visible={this.props.modalVisible}
          onRequestClose={() => this._popRoute()}>
          <ComposeComment
            contentID={latestRoute.contentID}
            contentType={latestRoute.contentType}
            contentAuthor={latestRoute.parentAuthor}
            renderParent={() => this._renderParent()}
            renderComments={() => this._renderChild()}
            closeModal={() => this._popRoute()}
          />
        </Modal>
        <CommentsView route={this.props.initialRoute} pushRoute={this._pushRoute.bind(this)}/>;
      </View>
    )
  }
};
