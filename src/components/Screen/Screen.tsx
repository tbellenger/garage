import { Component } from 'react';
import './Screen.css';

export interface Props {
    screenText: string;
}

interface State {}

class Screen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

    }
    render() {
        return (
            <input className='row password' type='password' value={this.props.screenText} />
        )
    }
}

export default Screen;