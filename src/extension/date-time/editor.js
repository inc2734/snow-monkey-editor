import { getBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { icon } from '../../helper/icon';
import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';

import customAttributes from './attributes.json';
import DateTimePicker from './date-time-picker';

const addBlockAttributes = ( settings ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor.currentUser,
		'date-time'
	);
	if ( ! isApplyToUser ) {
		return settings;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		settings.name,
		'date-time'
	);
	if ( ! isApplyToBlock ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		...customAttributes,
	};
	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/date-time/attributes',
	addBlockAttributes
);

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, name } = props;

		const { smeStartDateTime, smeEndDateTime } = attributes;

		const isApplyToUser = isApplyExtensionToUser(
			snowmonkeyeditor.currentUser,
			'date-time'
		);
		if ( ! isApplyToUser ) {
			return <BlockEdit { ...props } />;
		}

		const isApplyToBlock = isApplyExtensionToBlock( name, 'date-time' );
		if ( ! isApplyToBlock ) {
			return <BlockEdit { ...props } />;
		}

		const blockType = getBlockType( name );
		if ( ! blockType ) {
			return <BlockEdit { ...props } />;
		}

		const startDateTimePanelClassName = smeStartDateTime
			? 'sme-extension-panel sme-extension-panel--enabled'
			: 'sme-extension-panel';

		const onChangeStartDateTime = ( value ) =>
			setAttributes( { smeStartDateTime: value } );

		const onResetStartDateTime = () =>
			setAttributes( { smeStartDateTime: undefined } );

		const endDateTimePanelClassName = smeEndDateTime
			? 'sme-extension-panel sme-extension-panel--enabled'
			: 'sme-extension-panel';

		const onChangeEndDateTime = ( value ) =>
			setAttributes( { smeEndDateTime: value } );

		const onResetEndDateTime = () =>
			setAttributes( { smeEndDateTime: undefined } );

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<PanelBody
						title={ __( 'Publish setting', 'snow-monkey-editor' ) }
						initialOpen={ false }
						icon={ icon }
						className={ startDateTimePanelClassName }
					>
						<DateTimePicker
							currentDate={ smeStartDateTime }
							onChange={ onChangeStartDateTime }
							onReset={ onResetStartDateTime }
						/>
					</PanelBody>

					<PanelBody
						title={ __(
							'Unpublish setting',
							'snow-monkey-editor'
						) }
						initialOpen={ false }
						icon={ icon }
						className={ endDateTimePanelClassName }
					>
						<DateTimePicker
							currentDate={ smeEndDateTime }
							onChange={ onChangeEndDateTime }
							onReset={ onResetEndDateTime }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withSnowMonkeyEditorDateTimeBlockEdit' );

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/date-time/block-edit',
	addBlockControl
);
