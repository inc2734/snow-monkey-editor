import { orderBy } from 'lodash';

import { BlockFormatControls } from '@wordpress/block-editor';

import {
	Slot,
	ToolbarItem,
	ToolbarGroup,
	DropdownMenu,
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
					<Slot name="SnowMonkey.ToolbarControls">
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
											controls={ orderBy(
												fills.map(
													( [ { props } ] ) => props
												),
												'title'
											) }
											popoverProps={ POPOVER_PROPS }
										/>
									) }
								</ToolbarItem>
							)
						}
					</Slot>

					{ [
						'sme-font-size',
						'sme-letter-spacing',
						'sme-line-height',
						'sme-text-color',
						'sme-bg-color',
						'sme-highlighter',
						'sme-badge',
					].map( ( format ) => (
						<Slot
							name={ `SnowMonkey.ToolbarControls.${ format }` }
							key={ format }
						/>
					) ) }
				</ToolbarGroup>
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
