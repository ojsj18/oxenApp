import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

import {
  Container,
  Button,
  ButtonText,
} from './styles';

export default class Menu extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
    }).isRequired,
  };

  camOpen = () => {
    this.props.navigation.navigate('Cadastro');
  };

  render() {
    return (
      <Container>
          <Button onPress={this.camOpen}>
              <ButtonText>Camera</ButtonText>
          </Button>
      </Container>
    );
  }
}
