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

const icon = (
	<svg role="img" focusable="false" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M13.982,16.711c-0.744,1.441 -2.248,2.428 -3.982,2.428c-1.735,0 -3.238,-0.986 -3.983,-2.428c0.909,-1.213 2.355,-2.002 3.983,-2.002c1.629,0 3.074,0.789 3.982,2.002Zm-0.748,-7.657c-0.314,2.56 1.248,2.919 1.248,5.603c0,0.467 -0.072,0.918 -0.205,1.344c-1.037,-1.203 -2.57,-1.967 -4.277,-1.967c-1.708,0 -3.24,0.764 -4.277,1.967c-0.133,-0.426 -0.205,-0.877 -0.205,-1.344c0,-2.684 1.563,-3.043 1.247,-5.603c-0.362,-2.928 -4.315,-2.465 -4.315,-5.334c0,-1.579 1.279,-2.858 2.858,-2.858c1.709,0 2.765,1.558 4.692,1.558c1.926,0 2.982,-1.558 4.691,-1.558c1.578,0 2.857,1.279 2.857,2.858c0.001,2.869 -3.952,2.406 -4.314,5.334Zm-4.677,-4.947l-0.708,0c0,0.498 -0.403,0.9 -0.901,0.9c-0.498,0 -0.901,-0.402 -0.901,-0.9l-0.708,0c0,0.889 0.72,1.609 1.609,1.609c0.889,0 1.609,-0.72 1.609,-1.609Zm0.979,7.141c0,-0.312 -0.253,-0.568 -0.566,-0.568c-0.313,0 -0.567,0.256 -0.567,0.568c0,0.312 0.254,0.566 0.567,0.566c0.313,0 0.566,-0.253 0.566,-0.566Zm2.062,0c0,-0.312 -0.254,-0.568 -0.568,-0.568c-0.312,0 -0.566,0.256 -0.566,0.568c0,0.312 0.254,0.566 0.566,0.566c0.314,0 0.568,-0.253 0.568,-0.566Zm3.062,-7.141l-0.707,0c0,0.498 -0.404,0.9 -0.9,0.9c-0.498,0 -0.902,-0.402 -0.902,-0.9l-0.707,0c0,0.889 0.721,1.609 1.609,1.609c0.886,0.001 1.607,-0.72 1.607,-1.609Z" />
	</svg>
);

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