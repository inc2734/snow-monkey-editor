import './component/format-toolbar';

import { registerFormat } from './helper/register-format';

import * as remove from './remove/editor';
import * as fontSize from './font-size/editor';
import * as letterSpacing from './letter-spacing/editor';
import * as lineHeight from './line-height/editor';
import * as textColor from './text-color/editor';
import * as bgColor from './bg-color/editor';
import * as highlighter from './highlighter/editor';
import * as badge from './badge/editor';

registerFormat( remove );
registerFormat( fontSize );
registerFormat( letterSpacing );
registerFormat( lineHeight );
registerFormat( textColor );
registerFormat( bgColor );
registerFormat( highlighter );
registerFormat( badge );
