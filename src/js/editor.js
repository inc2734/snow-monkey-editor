'use strict';

import './format/component/format-toolbar';

import {
	registerFormat,
} from './format/helper/register-format';

import {
	registerStyle,
} from './style/helper/register-style';

import * as remove from './format/remove';
import * as fontSize from './format/font-size';
import * as textColor from './format/text-color';
import * as bgColor from './format/bg-color';
import * as highlighter from './format/highlighter';
import * as badge from './format/badge';

registerFormat( remove );
registerFormat( fontSize );
registerFormat( textColor );
registerFormat( bgColor );
registerFormat( highlighter );
registerFormat( badge );

import alert from './style/alert';
import alertSuccess from './style/alert-success';
import alertWarning from './style/alert-warning';
import alertRemark from './style/alert-remark';
import fluidShape1 from './style/fluid-shape-1';
import fluidShape2 from './style/fluid-shape-2';
import fluidShape3 from './style/fluid-shape-3';
import shadowed from './style/shadowed';

alert.forEach( ( props ) => registerStyle( props ) );
alertSuccess.forEach( ( props ) => registerStyle( props ) );
alertWarning.forEach( ( props ) => registerStyle( props ) );
alertRemark.forEach( ( props ) => registerStyle( props ) );
fluidShape1.forEach( ( props ) => registerStyle( props ) );
fluidShape2.forEach( ( props ) => registerStyle( props ) );
fluidShape3.forEach( ( props ) => registerStyle( props ) );
shadowed.forEach( ( props ) => registerStyle( props ) );
