import {
	getBlockType,
	hasBlockSupport,
	getBlockSupport,
} from '@wordpress/blocks';

import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, dispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { store as preferencesStore } from '@wordpress/preferences';
import { __ } from '@wordpress/i18n';

import { isApplyExtensionToUser } from '../extension/helper';

const PREFERENCE_SCOPE = 'snow-monkey-editor/preferences';

const GLOBAL_IGNORE_ATTRIBUTES = [
	'allowedBlocks',
	'content',
	'templateLock',
	'placeholder',
];

const useIsBlockPresetsDisabled = ( { name: blockName } = {} ) => {
	return ! hasBlockSupport( blockName, 'snowmonkeyeditor.blockPresets' );
};

const useIsShown = ( props ) => {
	if ( useIsBlockPresetsDisabled( props ) ) {
		return false;
	}

	const isApplyToUser = isApplyExtensionToUser(
		snowmonkeyeditor?.currentUser,
		'block-presets'
	);
	if ( ! isApplyToUser ) {
		return false;
	}

	const blockType = getBlockType( props.name );
	if ( ! blockType ) {
		return false;
	}

	return true;
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	dispatch( preferencesStore ).setDefaults( PREFERENCE_SCOPE, {
		blockPresets: {},
	} );

	return ( props ) => {
		if ( ! useIsShown( props ) ) {
			return <BlockEdit { ...props } />;
		}

		const { name, attributes, setAttributes } = props;

		const [ newPresetName, setNewPresetName ] = useState( undefined );
		const [ removPresetCount, setRemovPresetCount ] = useState( 0 );

		const blockPresets = useSelect( ( select ) => {
			return select( preferencesStore ).get(
				PREFERENCE_SCOPE,
				'blockPresets'
			);
		}, [] );

		const presets = blockPresets?.[ name ];
		const support = getBlockSupport(
			name,
			'snowmonkeyeditor.blockPresets'
		);
		const ignoreAttributes = support?.ignore || [];

		const BlockPresetButton = ( { blockName, presetName, preset } ) => (
			<div className="sme-editor-block-presets__preset">
				<Button
					onClick={ () => {
						const blockType = getBlockType( blockName );

						const resetedAttributes = {};
						Object.keys( blockType.attributes ).forEach(
							( attributeName ) => {
								resetedAttributes[ attributeName ] = undefined;
							}
						);

						GLOBAL_IGNORE_ATTRIBUTES.forEach( ( attributeName ) => {
							delete resetedAttributes[ attributeName ];
							delete preset[ attributeName ];
						} );

						ignoreAttributes.forEach( ( attributeName ) => {
							delete resetedAttributes[ attributeName ];
							delete preset[ attributeName ];
						} );

						setAttributes( {
							...resetedAttributes,
							...preset,
						} );
					} }
					variant="secondary"
				>
					{ presetName }
				</Button>

				<Button
					label={ __( 'Remove this preset', 'snow-monkey-editor' ) }
					onClick={ () => {
						const newBlockPresets = {
							...blockPresets,
						};
						delete newBlockPresets?.[ blockName ]?.[ presetName ];

						dispatch( preferencesStore ).set(
							PREFERENCE_SCOPE,
							'blockPresets',
							newBlockPresets
						);
						setRemovPresetCount( removPresetCount + 1 );
					} }
					variant="tertiary"
				>
					x
				</Button>
			</div>
		);

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<PanelBody title={ __( 'Presets', 'snow-monkey-editor' ) }>
						{ !! presets && !! Object.values( presets ) && (
							<div className="sme-editor-block-presets">
								{ Object.values( presets ).map(
									( preset, index ) => {
										const presetName =
											Object.keys( presets )[ index ];

										return (
											<BlockPresetButton
												blockName={ name }
												presetName={ presetName }
												preset={ preset }
												key={ index }
											/>
										);
									}
								) }
							</div>
						) }

						<div className="sme-editor-block-presets-inserter">
							<h3 className="sme-editor-block-presets-inserter__title">
								{ __(
									'Save current settings as a preset',
									'snow-monkey-editor'
								) }
							</h3>

							<div className="sme-editor-block-presets-inserter__control">
								<TextControl
									value={ newPresetName || '' }
									placeholder={ __(
										'Input the preset name.',
										'snow-monkey-editor'
									) }
									onChange={ ( newValue ) =>
										setNewPresetName( newValue )
									}
								/>

								<Button
									variant="primary"
									disabled={ ! newPresetName }
									onClick={ async () => {
										const newPreset = { ...attributes };

										GLOBAL_IGNORE_ATTRIBUTES.forEach(
											( attributeName ) => {
												delete newPreset[
													attributeName
												];
											}
										);

										ignoreAttributes.forEach(
											( attributeName ) => {
												delete newPreset[
													attributeName
												];
											}
										);

										const newBlockPresets = {
											...blockPresets,
											[ name ]: {
												...presets,
												[ newPresetName ]: {
													...newPreset,
												},
											},
										};

										dispatch( preferencesStore ).set(
											PREFERENCE_SCOPE,
											'blockPresets',
											newBlockPresets
										);
										setNewPresetName( undefined );
									} }
								>
									{ __( 'Save', 'snow-monkey-editor' ) }
								</Button>
							</div>
						</div>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControl' );

addFilter(
	'editor.BlockEdit',
	'snow-monkey-editor/block-presets/with-inspector-controls',
	withInspectorControls,
	100
);

const addBlockPresetsSupport = ( settings, name ) => {
	let blockPresets = false;

	if ( 'core/button' === name ) {
		blockPresets = {
			ignore: [ 'url', 'title', 'text', 'linkTarget', 'rel' ],
		};
	} else if ( 'core/cover' === name ) {
		blockPresets = {
			ignore: [ 'url' ],
		};
	} else if ( 'core/list' === name ) {
		blockPresets = {
			ignore: [ 'values' ],
		};
	} else if (
		'core/paragraph' === name ||
		'core/group' === name ||
		'core/columns' === name ||
		'core/column' === name ||
		'core/heading' === name
	) {
		blockPresets = true;
	}

	if ( false === blockPresets ) {
		return settings;
	}

	return {
		...settings,
		...{
			supports: {
				...settings.supports,
				...{
					snowmonkeyeditor: {
						blockPresets,
					},
				},
			},
		},
	};
};

addFilter(
	'blocks.registerBlockType',
	'snow-monkey-editor/block-presets/support',
	addBlockPresetsSupport
);
