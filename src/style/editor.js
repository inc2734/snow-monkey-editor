import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

/**
 * For orderd list styles
 */
addFilter(
	'editor.BlockListBlock',
	'snow-monkey-editor/ordered-list/orderd-styles',
	createHigherOrderComponent( ( BlockListBlock ) => {
		return ( props ) => {
			const { attributes, name } = props?.block;
			const { start, reversed, ordered, className } = attributes;

			if ( 'core/list' !== name ) {
				return <BlockListBlock { ...props } />;
			}

			if (
				! className?.match( 'is-style-sme-ordered-list-square' ) &&
				! className?.match( 'is-style-sme-ordered-list-circle' )
			) {
				return <BlockListBlock { ...props } />;
			}

			if ( ! ordered ) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<BlockListBlock
					{ ...props }
					wrapperProps={ {
						...props.wrapperProps,
						style: {
							...props.wrapperProps?.style,
							counterReset: reversed
								? `sme-count ${ start + 1 }`
								: `sme-count ${ start - 1 }`,
						},
					} }
				/>
			);
		};
	}, 'withSnowMonkeyEditorOrderdListOrderdStyles' )
);
