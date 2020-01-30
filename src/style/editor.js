'use strict';

import {
	registerStyle,
} from './helper/register-style';

import alert from './alert/editor';
import alertSuccess from './alert-success/editor';
import alertWarning from './alert-warning/editor';
import alertRemark from './alert-remark/editor';
import fluidShape1 from './fluid-shape-1/editor';
import fluidShape2 from './fluid-shape-2/editor';
import fluidShape3 from './fluid-shape-3/editor';
import listArrow from './list-arrow/editor';
import listCheck from './list-check/editor';
import listRemark from './list-remark/editor';
import postIt from './post-it/editor';
import postItNarrow from './post-it-narrow/editor';
import shadowed from './shadowed/editor';
import speech from './speech/editor';

alert.forEach( ( props ) => registerStyle( props ) );
alertSuccess.forEach( ( props ) => registerStyle( props ) );
alertWarning.forEach( ( props ) => registerStyle( props ) );
alertRemark.forEach( ( props ) => registerStyle( props ) );
fluidShape1.forEach( ( props ) => registerStyle( props ) );
fluidShape2.forEach( ( props ) => registerStyle( props ) );
fluidShape3.forEach( ( props ) => registerStyle( props ) );
listArrow.forEach( ( props ) => registerStyle( props ) );
listCheck.forEach( ( props ) => registerStyle( props ) );
listRemark.forEach( ( props ) => registerStyle( props ) );
postIt.forEach( ( props ) => registerStyle( props ) );
postItNarrow.forEach( ( props ) => registerStyle( props ) );
shadowed.forEach( ( props ) => registerStyle( props ) );
speech.forEach( ( props ) => registerStyle( props ) );
