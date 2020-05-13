import { CopyOutlined } from '@ant-design/icons';
import React from 'react';

import Shakespeare from '../../../utils/shakespeare';

interface Props {
    type: 'book' | 'name' | 'potion' | 'treasure';
}

interface State {
    values: string[];
}

export default class SimpleGenerator extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            values: []
        };
    }

    private generate() {
        const values: string[] = [];
        while (values.length < 10) {
            let v = '';
            switch (this.props.type) {
                case 'book':
                    v = Shakespeare.generateBookTitle();
                    break;
                case 'name':
                    v = Shakespeare.generateName();
                    break;
                case 'potion':
                    v = Shakespeare.generatePotion();
                    break;
                case 'treasure':
                    v = Shakespeare.generateTreasure();
                    break;
            }
            if (!values.includes(v)) {
                values.push(v);
            }
        }
        values.sort();

        this.setState({
            values: values
        });
    }

    public render() {
        try {
            const values = [];
            for (let n = 0; n !== this.state.values.length; ++n) {
                values.push(
                    <GeneratedItem key={n} text={this.state.values[n]} />
                );
            }

            return (
                <div>
                    <button onClick={() => this.generate()}>generate</button>
                    {values.length > 0 ? <div className='divider' /> : null}
                    {values}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface GeneratedItemProps {
    text: string;
}

class GeneratedItem extends React.Component<GeneratedItemProps> {
    private copy(e: React.MouseEvent) {
        e.stopPropagation();
        navigator.clipboard.writeText(this.props.text);
    }

    public render() {
        try {
            return (
                <div className='generated-item group-panel'>
                    <div className='text-section'>
                        {this.props.text.toLowerCase()}
                    </div>
                    <div className='icon-section'>
                        <CopyOutlined title='copy' onClick={e => this.copy(e)} />
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
