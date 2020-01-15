'use strict';

import './component/format-toolbar';

import {
	registerFormat,
} from './helper/register-format';

import * as remove from './remove';
import * as fontSize from './font-size';
import * as textColor from './text-color';
import * as bgColor from './bg-color';
import * as highlighter from './highlighter';
import * as badge from './badge';

registerFormat( remove );
registerFormat( fontSize );
registerFormat( textColor );
registerFormat( bgColor );
registerFormat( highlighter );
registerFormat( badge );
