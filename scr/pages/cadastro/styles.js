import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  alignItems: center;
  justifyContent: center;
`;

const Button = styled.TouchableHighlight`
  padding: 20px;
  borderRadius: 50px;
  backgroundColor: #008000;
  alignSelf: stretch;
  margin: 50px;
  marginHorizontal: 20px;
`;

const ButtonText = styled.Text`
  color: #fff;
  fontWeight: bold;
  fontSize: 16px;
  textAlign: center;
`;

const Preview = styled.View`
width: 100%;
height: 100%;
flex: 1;
`;

export {
  Container,
  Button,
  ButtonText,
  Preview,
};
