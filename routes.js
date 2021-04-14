import { createStackNavigator } from 'react-navigation-stack';

import Menu from './scr/pages/menu';
import Cadastro from './scr/pages/cadastro';
import Cadastrados from './scr/pages/cadastrados';

const RoutesS = createStackNavigator({
  Cadastrados,
  Cadastro,
  Menu,
});

export default RoutesS;
