import { BlockFormatControls } from '@wordpress/block-editor';
import {
	Slot,
	__experimentalToolbarItem as ToolbarItem,
	ToolbarGroup,
	DropdownMenu
} from '@wordpress/components';
import { registerFormatType } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { icon } from '../../helper/icon';

const POPOVER_PROPS = {
	position: 'bottom left',
	isAlternate: true,
};

const Edit = () => {
	return (
		<BlockFormatControls>
			<div className="block-editor-format-toolbar">
				<ToolbarGroup>
					<Slot name="SnowMonkeyEditorButtonControls">
						{ ( fills ) =>
							fills.length !== 0 && (
								<ToolbarItem>
									{ ( toggleProps ) => (
										<DropdownMenu
											icon={ icon }
											label={ __(
												'Snow Monkey Editor Controls',
												'snow-monkey-editor'
											) }
											toggleProps={ toggleProps }
											popoverProps={ POPOVER_PROPS }
											controls={ fills.map(
												( [ { props } ] ) => props
											) }
										/>
									) }
								</ToolbarItem>
							)
						}
					</Slot>
				</ToolbarGroup>
				{ [
					'sme-font-size',
					'sme-text-color',
					'sme-bg-color',
					'sme-highlighter',
					'sme-badge',
				].map( ( format ) => (
					<Slot
						name={ `SnowMonkeyEditorButtonControls.${ format }` }
						key={ format }
					/>
				) ) }
			</div>
		</BlockFormatControls>
	);
};

registerFormatType( 'snow-monkey-editor/dropdown', {
	title: 'buttons',
	tagName: 'sme-dropdown',
	className: null,
	edit: Edit,
} );
