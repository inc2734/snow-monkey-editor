'use strict';

import {
	registerStyle,
} from './helper/register-style';

import alert from './alert';
import alertSuccess from './alert-success';
import alertWarning from './alert-warning';
import alertRemark from './alert-remark';
import fluidShape1 from './fluid-shape-1';
import fluidShape2 from './fluid-shape-2';
import fluidShape3 from './fluid-shape-3';
import shadowed from './shadowed';

alert.forEach( ( props ) => registerStyle( props ) );
alertSuccess.forEach( ( props ) => registerStyle( props ) );
alertWarning.forEach( ( props ) => registerStyle( props ) );
alertRemark.forEach( ( props ) => registerStyle( props ) );
fluidShape1.forEach( ( props ) => registerStyle( props ) );
fluidShape2.forEach( ( props ) => registerStyle( props ) );
fluidShape3.forEach( ( props ) => registerStyle( props ) );
shadowed.forEach( ( props ) => registerStyle( props ) );
