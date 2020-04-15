import { BlockFormatControls } from '@wordpress/block-editor';
import { Slot, Toolbar, DropdownMenu } from '@wordpress/components';
import { registerFormatType } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

import { icon } from '../../helper/icon';

const Edit = () => {
	return (
		<BlockFormatControls>
			<div className="block-editor-format-toolbar">
				<Toolbar>
					<Slot name="SnowMonkeyEditorButtonControls">
						{ ( fills ) =>
							fills.length && (
								<DropdownMenu
									icon={ icon }
									hasArrowIndicator={ true }
									position="bottom left"
									label={ __(
										'Snow Monkey Editor Controls',
										'snow-monkey-editor'
									) }
									controls={ fills.map(
										( [ { props } ] ) => props
									) }
								/>
							)
						}
					</Slot>
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
				</Toolbar>
			</div>
		</BlockFormatControls>
	);
};

registerFormatType( 'snow-monkey-editor/dropdown', {
	title: 'buttons',
	tagName: 'dropdown',
	className: null,
	edit: Edit,
} );
