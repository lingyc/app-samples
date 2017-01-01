import React, {Component} from 'react';
import { TextInput } from 'react-native';

class AutoExpandingTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
  }
  render() {
    return (
      <TextInput
        {...this.props}
        onContentSizeChange={(event) => {
          this.setState({height: event.nativeEvent.contentSize.height});
        }}
        style={[{height: Math.max(35, this.state.height)}, this.props.style]}
      />
    );
  }
};

export default AutoExpandingTextInput;
