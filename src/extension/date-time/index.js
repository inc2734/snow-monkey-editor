'use select';

import {
	getBlockType,
} from '@wordpress/blocks';

import {
	InspectorControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
} from '@wordpress/components';

import {
	addFilter,
} from '@wordpress/hooks';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

import {
	__,
} from '@wordpress/i18n';

import {
	icon,
} from '../../js/helper/icon';

import DateTimePicker from './date-time-picker';

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/date-time/attributes',
	( settings ) => {
		settings.attributes = {
			...settings.attributes,
			startDateTime: {
				type: 'date',
				default: null,
			},
			endDateTime: {
				type: 'date',
				default: null,
			},
		};
		return settings;
	}
);

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/date-time/block-edit',
	createHigherOrderComponent(
		( BlockEdit ) => {
			return ( props ) => {
				const {
					attributes,
					setAttributes,
					name,
				} = props;

				const {
					startDateTime,
					endDateTime,
				} = attributes;

				if ( 'undefined' === typeof startDateTime || 'undefined' === typeof endDateTime ) {
					return <BlockEdit { ...props } />;
				}

				const blockType = getBlockType( name );
				if ( ! blockType ) {
					return <BlockEdit { ...props } />;
				}

				return (
					<>
						<BlockEdit { ...props } />

						<InspectorControls>
							<PanelBody
								title={ __( 'Publish setting', 'snow-monkey-editor' ) }
								initialOpen={ false }
								icon={ icon }
								className={ startDateTime ? `sme-extension-enabled` : undefined }
							>
								<DateTimePicker
									currentDate={ startDateTime }
									onChange={ ( value ) => setAttributes( { startDateTime: value } ) }
									onReset={ () => setAttributes( { startDateTime: null } ) }
								/>
							</PanelBody>

							<PanelBody
								title={ __( 'Unpublish setting', 'snow-monkey-editor' ) }
								initialOpen={ false }
								icon={ icon }
								className={ endDateTime ? `sme-extension-enabled` : undefined }
							>
								<DateTimePicker
									currentDate={ endDateTime }
									onChange={ ( value ) => setAttributes( { endDateTime: value } ) }
									onReset={ () => setAttributes( { endDateTime: null } ) }
								/>
							</PanelBody>
						</InspectorControls>
					</>
				);
			};
		},
		'withSnowMonkeyEditorDateTimeBlockEdit'
	)
);
