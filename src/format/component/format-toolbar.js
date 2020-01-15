'use strict';

import {
	BlockFormatControls,
} from '@wordpress/editor';

import {
	Slot,
	Toolbar,
	DropdownMenu,
} from '@wordpress/components';

import {
	registerFormatType,
} from '@wordpress/rich-text';

import {
	__,
} from '@wordpress/i18n';

import {
	icon,
} from '../../js/helper/icon';

registerFormatType(
	'snow-monkey-editor/dropdown',
	{
		title: 'buttons',
		tagName: 'dropdown',
		className: null,
		edit() {
			return (
				<BlockFormatControls>
					<div className="editor-format-toolbar block-editor-format-toolbar">
						<Toolbar>
							<Slot name="SnowMonkeyEditorButtonControls">
								{ ( fills ) => fills.length &&
									<DropdownMenu
										icon={ icon }
										hasArrowIndicator={ true }
										position="bottom left"
										label={ __( 'Snow Monkey Editor Controls', 'snow-monkey-editor' ) }
										controls={ fills.map( ( [ { props } ] ) => props ) }
									/>
								}
							</Slot>
						</Toolbar>
					</div>
				</BlockFormatControls>
			);
		},
	}
);
