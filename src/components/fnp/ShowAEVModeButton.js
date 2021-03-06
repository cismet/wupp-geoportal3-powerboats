import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';

const Comp = ({ aevVisible = false, setAevVisible = (visible) => {}, fontSize = '40px' }) => {
	return (
		<div
			key='featureInfoModeButton'
			style={{
				marginBottom: 5,
				textAlign: 'right',
				pointerEvents: 'auto'
			}}
		>
			<Button
				id='cmdShowGetFeatureInfo'
				onClick={(e) => {
					e.stopPropagation();
					setAevVisible(!aevVisible);
				}}
				style={{
					width: '247px',
					fontSize: '1.2em',
					verticalAlign: 'middle'
				}}
			>
				<table>
					<tbody>
						<tr>
							<td>
								<FontAwesomeIcon
									className='fa-1x'
									icon={aevVisible === true ? faToggleOn : faToggleOff}
								/>
							</td>
							<td style={{ paddingLeft: '5px' }}>
								<span>
									{aevVisible === true ? (
										'Änderungsverfahren verbergen'
									) : (
										'Änderungsverfahren anzeigen'
									)}
								</span>
							</td>
						</tr>
					</tbody>
				</table>
			</Button>
		</div>
	);
};

export default Comp;
