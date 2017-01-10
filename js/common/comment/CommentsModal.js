import React, {Component} from 'react';
import { Modal, View } from 'react-native';
import CommentsView from './CommentsView.js';
import ComposeComment from './ComposeComment.js';
import ParentView from './ParentView.js';

export default class CommentsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeStack: [this.props.initialRoute],
      skipInititalRoute: false
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
    const pop = () => {
      let newRoutes = this.state.routeStack.slice();
      newRoutes.pop();
      this.setState({routeStack: newRoutes});
    };

    let minStackSize = (this.state.skipInititalRoute) ? 2 : 1;
    if (this.state.routeStack.length > minStackSize) {
      pop();
    } else {
      if (this.state.skipInititalRoute) {
        this.setState({skipInititalRoute: false});
        pop();
      }
      this.props.closeModal();
    }
  };

  _renderParent(routeStack, latestRoute) {
    return (routeStack.length > 1) ? <ParentView route={latestRoute}/> : this.props.renderParent();
  };

  _renderChild(latestRoute) {
    return <CommentsView route={latestRoute} pushRoute={this._pushRoute.bind(this)}/>;
  };

  render() {
    const stackSize = this.state.routeStack.length;
    const latestRoute = this.state.routeStack[this.state.routeStack.length - 1];
    return (
      <View>
        <Modal
          animationType={"fade"}
          transparent={false}
          visible={this.props.modalVisible}
          onRequestClose={() => this._popRoute()}>
          <ComposeComment
            contentInfo={latestRoute}
            renderParent={() => this._renderParent(this.state.routeStack, latestRoute)}
            renderComments={() => this._renderChild(latestRoute)}
            closeModal={() => this._popRoute()}
          />
        </Modal>
        <CommentsView
          route={this.props.initialRoute}
          openModal={() => {
            this.setState({skipInititalRoute: true})
            this.props.openModal();
          }}
          pushRoute={this._pushRoute.bind(this)}/>
      </View>
    )
  }
};

CommentsModal.propTypes = {
  modalVisible: React.PropTypes.bool,
  renderParent: React.PropTypes.func,
  closeModal: React.PropTypes.func,
  initialRoute: React.PropTypes.object,
};
