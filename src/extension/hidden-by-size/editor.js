import { compact } from 'lodash';
import classnames from 'classnames/dedupe';

import { hasBlockSupport, getBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { icon } from '../../helper/icon';
import { isApplyExtensionToBlock, isApplyExtensionToUser } from '../helper';
import customAttributes from './attributes.json';

const addBlockAttributes = ( settings ) => {
	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor.currentUser,
		'hidden-by-size'
	);
	if ( ! isApplyToUser ) {
		return settings;
	}

	const isApplyToBlock = isApplyExtensionToBlock(
		settings.name,
		'hidden-by-size'
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
	'snow-monkey-editor/hidden-by-size/attributes',
	addBlockAttributes
);

const addBlockControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { attributes, setAttributes, name } = props;

		const {
			smeIsHiddenSm,
			smeIsHiddenMd,
			smeIsHiddenLg,
			className,
		} = attributes;

		const isApplyToUser = isApplyExtensionToUser(
			snowmonkeyeditor.currentUser,
			'hidden-by-size'
		);
		if ( ! isApplyToUser ) {
			return <BlockEdit { ...props } />;
		}

		const isApplyToBlock = isApplyExtensionToBlock(
			name,
			'hidden-by-size'
		);
		if ( ! isApplyToBlock ) {
			return <BlockEdit { ...props } />;
		}

		if (
			'undefined' === typeof smeIsHiddenSm ||
			'undefined' === typeof smeIsHiddenMd ||
			'undefined' === typeof smeIsHiddenLg
		) {
			return <BlockEdit { ...props } />;
		}

		const blockType = getBlockType( name );
		if ( ! blockType ) {
			return <BlockEdit { ...props } />;
		}

		if ( ! hasBlockSupport( blockType, 'customClassName', true ) ) {
			return <BlockEdit { ...props } />;
		}

		const panelClassName =
			0 <
			compact( [ smeIsHiddenSm, smeIsHiddenMd, smeIsHiddenLg ] ).length
				? 'sme-extension-panel sme-extension-panel--enabled'
				: 'sme-extension-panel';

		const onChangeIsHiddenSm = ( value ) => {
			setAttributes( {
				smeIsHiddenSm: value,
				className: classnames( className, {
					'sme-hidden-sm': value,
				} ),
			} );
		};

		const onChangeIsHiddenMd = ( value ) => {
			setAttributes( {
				smeIsHiddenMd: value,
				className: classnames( className, {
					'sme-hidden-md': value,
				} ),
			} );
		};

		const onChangeIsHiddenLg = ( value ) => {
			setAttributes( {
				smeIsHiddenLg: value,
				className: classnames( className, {
					'sme-hidden-lg-up': value,
				} ),
			} );
		};

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<PanelBody
						title={ __(
							'Display setting (By window size)',
							'snow-monkey-editor'
						) }
						initialOpen={ false }
						icon={ icon }
						className={ panelClassName }
					>
						<ToggleControl
							label={ __(
								'Hide on smartphone size',
								'snow-monkey-editor'
							) }
							checked={ smeIsHiddenSm }
							onChange={ onChangeIsHiddenSm }
						/>

						<ToggleControl
							label={ __(
								'Hide on tablet size',
								'snow-monkey-editor'
							) }
							checked={ smeIsHiddenMd }
							onChange={ onChangeIsHiddenMd }
						/>

						<ToggleControl
							label={ __(
								'Hide on PC size',
								'snow-monkey-editor'
							) }
							checked={ smeIsHiddenLg }
							onChange={ onChangeIsHiddenLg }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withSnowMonkeyEditorHiddenBySizeBlockEdit' );

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/hidden-by-size/block-edit',
	addBlockControl
);
