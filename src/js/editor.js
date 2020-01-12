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
import fluidShape1 from './style/fluid-shape-1';
import fluidShape2 from './style/fluid-shape-2';
import fluidShape3 from './style/fluid-shape-3';
import overwrapLb from './style/overwrap-lb';
import overwrapLm from './style/overwrap-lm';
import overwrapRb from './style/overwrap-rb';
import overwrapRm from './style/overwrap-rm';
import panels from './style/panels';
import section from './style/section';
import sectionTitle from './style/section-title';
import shadowed from './style/shadowed';
import slimWidth from './style/slim-width';

alert.forEach( ( props ) => registerStyle( props ) );
alertSuccess.forEach( ( props ) => registerStyle( props ) );
alertWarning.forEach( ( props ) => registerStyle( props ) );
fluidShape1.forEach( ( props ) => registerStyle( props ) );
fluidShape2.forEach( ( props ) => registerStyle( props ) );
fluidShape3.forEach( ( props ) => registerStyle( props ) );
overwrapLb.forEach( ( props ) => registerStyle( props ) );
overwrapLm.forEach( ( props ) => registerStyle( props ) );
overwrapRb.forEach( ( props ) => registerStyle( props ) );
overwrapRm.forEach( ( props ) => registerStyle( props ) );
panels.forEach( ( props ) => registerStyle( props ) );
section.forEach( ( props ) => registerStyle( props ) );
sectionTitle.forEach( ( props ) => registerStyle( props ) );
shadowed.forEach( ( props ) => registerStyle( props ) );
slimWidth.forEach( ( props ) => registerStyle( props ) );
