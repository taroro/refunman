import React from 'react';
import {Router, Scene, Modal, Stack, ActionConst} from 'react-native-router-flux';
import Home from '../Home';

const Routes = () => (
   <Router>
      <Modal hideNavBar>
         <Stack key='root'>
            <Scene key='home' component={Home} hideNavBar initial type={ActionConst.RESET} />
         </Stack>
      </Modal>
   </Router>
)
export default Routes;