import { Icon } from '@wordpress/components';
import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SnowMonkeyToolbarButton } from '../component/snow-monkey-toolbar-button';
import { default as InlineUI } from './inline';

const name = 'snow-monkey-editor/br';
const title = __( 'Break', 'snow-monkey-editor' );

const Edit = ( props ) => {
	const { value, onChange, isActive } = props;

	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const openModal = useCallback( () => setIsModalOpen( true ), [
		setIsModalOpen,
	] );

	const closeModal = useCallback( () => setIsModalOpen( false ), [
		setIsModalOpen,
	] );

	return (
		<>
			<SnowMonkeyToolbarButton
				key={ isActive ? 'sme-br' : 'sme-br-not-active' }
				name={ isActive ? 'sme-br' : undefined }
				title={ title }
				className="format-library-text-color-button sme-toolbar-button"
				onClick={ openModal }
				icon={
					<>
						<Icon icon="edit" />
						{ isActive && (
							<span
								className="format-library-text-color-button__indicator sme-toolbar-button__indicator"
								style={ { backgroundColor: '#cd162c' } }
							/>
						) }
					</>
				}
			/>

			{ isModalOpen && (
				<InlineUI
					name={ name }
					value={ value }
					isOpen={ isModalOpen }
					onClose={ closeModal }
					onChange={ onChange }
				/>
			) }
		</>
	);
};

export const settings = {
	name,
	title,
	object: true,
	tagName: 'br',
	className: null,
	attributes: {
		className: 'class',
		dataRichTextLineBreak: 'data-rich-text-line-break',
	},
	edit: Edit,
};
