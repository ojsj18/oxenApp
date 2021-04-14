import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Platform,Image } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Camera, ImageType } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import {cameraWithTensors,bundleResourceIO} from '@tensorflow/tfjs-react-native';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import { argMax, reshape } from '@tensorflow/tfjs';
//import {lambdaLayer} from './CustomLayer.js';
import {antirectifier} from './custom_layer';
import {LambdaLayer} from './CustomLayer.js';

console.disableYellowBox = true;

export default function App() {

  const [predictionFound, setPredictionFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [mobilenetModel1, setMobilenetModel1] = useState(null);
  const [modelFound, setModelFound] = useState(false);
  const [Prediction, setPrediction] = useState(null);
  const [modelo, setmodelo] = useState(null);
  const [time, settime] = useState(0);
  const TensorCamera = cameraWithTensors(Camera);
  let requestAnimationFrameId = 0;

  //performance hacks (Platform dependent)
  const textureDims = Platform.OS === "ios"? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  const tensorDims = { width: 224, height: 224 }; 

  useEffect(() => {
    if(!frameworkReady) {
      (async () => {
        const { status } = await Camera.requestPermissionsAsync();
        console.log(`permissions status: ${status}`);
        setHasPermission(status === 'granted');
        await tf.ready();
        setMobilenetModel(await loadMobileNetModel());
        setFrameworkReady(true);

      })();
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  const loadMobileNetModel = async () => {
    //rede 1
    const modelJson = require('./model.json');
    const modelWeights= require('./group1-shard.bin');
    //rede2
    //const modelJson1 = require('./jorge/model.json');
    //const modelWeights1= require('./jorge/weights.bin');
    console.log("carregando modelo...");
    var beforeLoad= new Date();
    const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    //const model1 = await tf.loadLayersModel(bundleResourceIO(modelJson1, modelWeights1));
    //setmodelo(model1);
    var Afterload=  new Date();
    console.log("modelo carregado");
    settime(Afterload-beforeLoad);
    setModelFound(true);
    return model;
  }
 
  const getPrediction = async(tensor) => {

    //const image = require('./good.jpeg');
    //const imageAssetPath = Image.resolveAssetSource(image);
    //const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    //const imageData = await response.arrayBuffer();
    //const imageTensor = decodeJpeg(imageData);
    var before= new Date();
    const prediction = await mobilenetModel.predict(tensor).data();
    var after= new Date();
    settime(after-before);
    //console.log(after-before);
    console.log("modelo1 "+prediction)
    //const prediction2 = await modelo.predict(tensor).data();
    console.log("modelo2 "+prediction2)
    if(prediction[0]>prediction[1]){
      console.log("esta de mascara")
    }
    //const results = await mobilenetModel.predict(tensor).dataSync();
    //console.log(results);
    //console.log('argmax:');
    //const teste = Math.round(results.dataSync()[0] * 100);
    //console.log(teste);
    
  }
  
  const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {

      if(modelFound){
        const nextImageTensor = await imageAsTensors.next().value;
        const floatImageTensor = tf.cast(nextImageTensor, 'float32');
        //const ReshapeImageTensor = floatImageTensor.reshape([3, 128, 128, 1]);
        const ReshapeImageTensor = floatImageTensor.reshape([-1, 224, 224,3]);
        //const logits = ReshapeImageTensor.div(tf.scalar(255));
        await getPrediction(ReshapeImageTensor);
      }

      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    if(!predictionFound) loop();
  }

  const renderCameraView = () => {
    return <View style={styles.cameraView}>
                <TensorCamera
                  style={styles.camera}
                  type={Camera.Constants.Type.back}
                  zoom={0}
                  cameraTextureHeight={textureDims.height}
                  cameraTextureWidth={textureDims.width}
                  resizeHeight={tensorDims.height}
                  resizeWidth={tensorDims.width}
                  resizeDepth={3}
                  onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
                  autorender={true}
                />
            </View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
            TFJS ready? {frameworkReady ? <Text>Yes</Text> : ''}
        </Text>
        <Text style={styles.title}>
            Model ready? {modelFound ? <Text>Yes</Text> : ''}
        </Text>
        <Text style={styles.title}>
            Time {time} ms
        </Text>
      </View>

      <View style={styles.body}>
        {renderCameraView()}
      </View>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#E8E8E8',
  },
  header: {
    backgroundColor: '#41005d'
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  body: {
    padding: 5,
    paddingTop: 25
  },
  cameraView: {
    display: 'flex',
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 10
  },
  camera : {
    width: 700/2,
    height: 800/2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  translationView: {
    marginTop: 30, 
    padding: 20,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    height: 500
  },
  translationTextField: {
    fontSize:60
  },
  wordTextField: {
    textAlign:'right', 
    fontSize:20, 
    marginBottom: 50
  },
  legendTextField: {
    fontStyle: 'italic',
    color: '#888888'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'purple',
    borderStyle: 'solid',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 3,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#cccccc'
  },
});
