import React, { useState, useEffect, useRef,Component } from 'react';
import PropTypes from 'prop-types';
import { Camera } from 'expo-camera';

import { Modal,ImageBackground,TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';

import {
  Container,
  Button,
  ButtonText,
} from './styles';

//padrão do java é chamar primeiro a sua classe mãe
export default class Cadastro extends Component {
  
  static navigationOptions = {
    headerShown: false,
  };

  async UNSAFE_componentWillUpdate() {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  //tipo de retorno que exisgiram no programa
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      dispatch: PropTypes.func,
      goBack: PropTypes.func,
    }).isRequired,
  };

  //função tira foto
  takePicture = async function() {
    if (this.camera) {
      this.props.navigation.navigate('Cadastrados');
      const options = { quality: 0.5, base64: true };
      //imagem sai dessa função
      const data =  await this.camera.takePictureAsync(options)
      //endereço da imagem
      this.setState({ image: data.uri});
      console.log(this.state.image);
      //chama a função modal
      this.setState({isVisible: true});

    }
    
  }

  //função que controls visibilidade do modal  
  constructor(props){
    super(props);
    this.state = {isVisible: false};  
  }

  salvarFoto = () => {
    //MediaLibrary.createAssetAsync(this.state.image);
    this.setState({isVisible: false});
   
  };

  nsalvarFoto = () => {
    this.setState({isVisible:false});
   
  };

  render() {
    return (
      <Container>
          <Modal
            animationType={'none'}
            transparent={false}
            visible={this.state.isVisible}
            onRequestClose={() => {
                this.setState({isVisible:false});
            } }
          >
          <ImageBackground source={{uri:this.state.image}}
                 style={{width: "100%", height: "100%", flex: 1}} 
          >
          
          <Button>
            <TouchableOpacity onPress={this.salvarFoto}>
              <ButtonText>salvar</ButtonText>
            </TouchableOpacity>
          </Button>
          <Button>
            <TouchableOpacity onPress={this.nsalvarFoto}>
              <ButtonText>voltar</ButtonText>
            </TouchableOpacity>
          </Button>

          </ImageBackground>
          
          </Modal>

          <Camera
              ref={ref => {
                this.camera = ref;
              }}
              style={{width: "100%", height: "100%", flex: 1}}
              type={Camera.Constants.Type.back}
              flashMode={Camera.Constants.FlashMode.off}
              androidCameraPermissionOption={'Permission to use camera'}

          >
          <Button >
          <TouchableOpacity onPress={this.takePicture.bind(this)}>
            <ButtonText>tape</ButtonText>
          </TouchableOpacity>
          </Button>
          </Camera>
        </Container>
    );
  }
}
