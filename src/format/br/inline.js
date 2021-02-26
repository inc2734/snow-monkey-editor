import classnames from 'classnames';

import { URLPopover } from '@wordpress/block-editor';
import {
	withSpokenMessages,
	ToggleControl,
	Button,
} from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import { useMemo, useState } from '@wordpress/element';
import { insertObject } from '@wordpress/rich-text';
import { __ } from '@wordpress/i18n';

const PopoverAtLink = ( { isOpen, ...props } ) => {
	const anchorRect = useMemo( () => {
		// eslint-disable-next-line @wordpress/no-global-get-selection
		const selection = window.getSelection();
		const range =
			selection.rangeCount > 0 ? selection.getRangeAt( 0 ) : null;
		if ( ! range ) {
			return;
		}

		if ( isOpen ) {
			return getRectangleFromRange( range );
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		const closest = element.closest( 'span' );
		if ( closest ) {
			return closest.getBoundingClientRect();
		}
	}, [] );

	if ( ! anchorRect ) {
		return null;
	}

	return <URLPopover anchorRect={ anchorRect } { ...props } />;
};

const InlineUI = ( { name, value, onClose, isOpen, onChange } ) => {
	const [ isDisableSm, setIsDisableSm ] = useState( false );
	const [ isDisableMd, setIsDisableMd ] = useState( false );
	const [ isDisableLg, setIsDisableLg ] = useState( false );

	return (
		<PopoverAtLink
			isOpen={ isOpen }
			onClose={ onClose }
			className="sme-popover components-inline-color-popover"
		>
			<form
				onSubmit={ ( event ) => {
					onChange(
						insertObject( value, {
							type: name,
							attributes: {
								dataRichTextLineBreak: 'true',
								className: classnames( 'sme-br', {
									'sme-hidden-sm': isDisableSm,
									'sme-hidden-md': isDisableMd,
									'sme-hidden-lg-up': isDisableLg,
								} ),
							},
						} )
					);
					event.preventDefault();
					onClose();
				} }
			>
				<ToggleControl
					label={ __(
						'Disable on smartphone size',
						'snow-monkey-forms'
					) }
					checked={ isDisableSm }
					onChange={ () => setIsDisableSm( ! isDisableSm ) }
				/>

				<ToggleControl
					label={ __(
						'Disable on tablet size',
						'snow-monkey-forms'
					) }
					checked={ isDisableMd }
					onChange={ () => setIsDisableMd( ! isDisableMd ) }
				/>

				<ToggleControl
					label={ __( 'Disable on PC size', 'snow-monkey-forms' ) }
					checked={ isDisableLg }
					onChange={ () => setIsDisableLg( ! isDisableLg ) }
				/>

				<Button isPrimary={ true } type="submit">
					{ __( 'Insert', 'snow-monkey-editor' ) }
				</Button>
			</form>
		</PopoverAtLink>
	);
};

export default withSpokenMessages( InlineUI );
