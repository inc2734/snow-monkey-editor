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
	useSelect,
} from '@wordpress/data';

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
} from '../../helper/icon';

import {
	isApplyExtensionToBlock,
	isApplyExtensionToUser,
} from '../helper';

import customAttributes from './attributes';
import DateTimePicker from './date-time-picker';

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/date-time/attributes',
	( settings ) => {
		settings.attributes = {
			...settings.attributes,
			...customAttributes,
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
					smeStartDateTime,
					smeEndDateTime,
				} = attributes;

				const currentUser = useSelect( ( select ) => {
					return select( 'core' ).getCurrentUser();
				}, [] );

				if ( 0 < Object.keys( currentUser ).length ) {
					const isApplyToUser = isApplyExtensionToUser( currentUser, 'date-time' );
					if ( ! isApplyToUser ) {
						return <BlockEdit { ...props } />;
					}
				}

				const isApplyToBlock = isApplyExtensionToBlock( name, 'date-time' );
				if ( ! isApplyToBlock ) {
					return <BlockEdit { ...props } />;
				}

				if ( 'undefined' === typeof smeStartDateTime || 'undefined' === typeof smeEndDateTime ) {
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
								className={ smeStartDateTime ? 'sme-extension-panel sme-extension-panel--enabled' : 'sme-extension-panel' }
							>
								<DateTimePicker
									currentDate={ smeStartDateTime }
									onChange={ ( value ) => setAttributes( { smeStartDateTime: value } ) }
									onReset={ () => setAttributes( { smeStartDateTime: null } ) }
								/>
							</PanelBody>

							<PanelBody
								title={ __( 'Unpublish setting', 'snow-monkey-editor' ) }
								initialOpen={ false }
								icon={ icon }
								className={ smeEndDateTime ? 'sme-extension-panel sme-extension-panel--enabled' : 'sme-extension-panel' }
							>
								<DateTimePicker
									currentDate={ smeEndDateTime }
									onChange={ ( value ) => setAttributes( { smeEndDateTime: value } ) }
									onReset={ () => setAttributes( { smeEndDateTime: null } ) }
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
