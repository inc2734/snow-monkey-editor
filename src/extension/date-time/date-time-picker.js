import { Button, DateTimePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ( { currentDate, onChange, onReset } ) {
	return (
		<div className="sme-date-time-picker">
			<DateTimePicker
				currentDate={ currentDate }
				onChange={ onChange }
				is12Hour={ false }
			/>

			<div className="sme-date-time-picker__action">
				<div>{ currentDate }</div>
				<Button isSmall onClick={ onReset }>
					{ __( 'Clear', 'snow-monkey-editor' ) }
				</Button>
			</div>
		</div>
	);
}
