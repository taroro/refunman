import React from 'react';
import {Router, Scene, Modal, Stack, ActionConst} from 'react-native-router-flux';
import Home from '../Home';
import PostDetail from '../Home/postDetail';
import QuotationStep1 from '../Quotation/index';
import CategorySelect from '../Quotation/categorySelect';
import QuantitySelect from '../Quotation/quantitySelect';
import ConfirmQuotation from '../Quotation/confirm';
import DealDetail from '../Quotation/dealDetail';
import ReceiptStep1 from '../Receipt/index';
import CategoryReceipt from '../Receipt/categorySelect';
import QuantityReceipt from '../Receipt/quantitySelect';
import PriceReceipt from '../Receipt/priceSelect';
import ConfirmReceipt from '../Receipt/confirm';


const Routes = () => (
   <Router>
      <Modal hideNavBar>
         <Stack key='root'>
            <Scene key='home' component={Home} hideNavBar initial type={ActionConst.RESET} />
            <Scene key='postdetail' component={PostDetail} hideNavBar type={ActionConst.PUSH} />
            <Scene key='quotationstep1' component={QuotationStep1} hideNavBar type={ActionConst.PUSH} />
            <Scene key='confirmquotation' component={ConfirmQuotation} hideNavBar type={ActionConst.PUSH} />
            <Scene key='dealdetail' component={DealDetail} hideNavBar type={ActionConst.PUSH} />
            <Scene key='receiptstep1' component={ReceiptStep1} hideNavBar type={ActionConst.PUSH} />
            <Scene key='confirmreceipt' component={ConfirmReceipt} hideNavBar type={ActionConst.PUSH} />
         </Stack>
         <Scene key='categoryselect' component={CategorySelect} hideNavBar />
         <Scene key='quantityselect' component={QuantitySelect} hideNavBar />
         <Scene key='categoryreceipt' component={CategoryReceipt} hideNavBar />
         <Scene key='quantityreceipt' component={QuantityReceipt} hideNavBar />
         <Scene key='pricereceipt' component={PriceReceipt} hideNavBar />
      </Modal>
   </Router>
)
export default Routes;