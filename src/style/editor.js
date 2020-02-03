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
import listTimes from './list-times/editor';
import orderedListCircle from './ordered-list-circle/editor';
import orderedListSquare from './ordered-list-square/editor';
import postIt from './post-it/editor';
import postItNarrow from './post-it-narrow/editor';
import shadowed from './shadowed/editor';
import speech from './speech/editor';

[
	alert,
	alertSuccess,
	alertWarning,
	alertRemark,
	fluidShape1,
	fluidShape2,
	fluidShape3,
	listArrow,
	listCheck,
	listRemark,
	listTimes,
	orderedListCircle,
	orderedListSquare,
	postIt,
	postItNarrow,
	shadowed,
	speech,
].forEach(
	( component ) => {
		component.forEach( ( props ) => registerStyle( props ) );
	}
);
