import React from 'react';
import {Router, Scene, Modal, Stack, ActionConst} from 'react-native-router-flux';
import Home from '../Home';
import PostDetail from '../Home/postDetail';
import QuotationStep1 from '../Quotation/index';
import CategorySelect from '../Quotation/categorySelect';
import QuantitySelect from '../Quotation/quantitySelect';
import ConfirmQuotation from '../Quotation/confirm';
import DealDetail from '../Quotation/dealDetail';

const Routes = () => (
   <Router>
      <Modal hideNavBar>
         <Stack key='root'>
            <Scene key='home' component={Home} hideNavBar initial type={ActionConst.RESET} />
            <Scene key='postdetail' component={PostDetail} hideNavBar type={ActionConst.PUSH} />
            <Scene key='quotationstep1' component={QuotationStep1} hideNavBar type={ActionConst.PUSH} />
            <Scene key='confirmquotation' component={ConfirmQuotation} hideNavBar type={ActionConst.PUSH} />
            <Scene key='dealdetail' component={DealDetail} hideNavBar type={ActionConst.PUSH} />
         </Stack>
         <Scene key='categoryselect' component={CategorySelect} hideNavBar />
         <Scene key='quantityselect' component={QuantitySelect} hideNavBar />
      </Modal>
   </Router>
)
export default Routes;