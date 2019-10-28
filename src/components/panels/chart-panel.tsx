import React from 'react';

interface Props {
    data: { text: string, value: number }[];
}

export default class ChartPanel extends React.Component<Props> {
    public render() {
        try {
            const max = Math.max(...this.props.data.map(d => d.value));

            const first = this.props.data.find(d => d.value > 0);
            this.props.data.reverse();
            const last = this.props.data.find(d => d.value > 0);
            this.props.data.reverse();
            const start = first ? this.props.data.indexOf(first) : 0;
            const end = last ? this.props.data.indexOf(last) : this.props.data.length - 1;

            const bars = this.props.data.slice(start, end + 1).map(d => (
                <div key={d.text} className='bar-container'>
                    <div
                        className='bar'
                        style={{
                            width: 'calc((100% - 1px) * ' + d.value + ' / ' + max + ')'
                        }}
                    >
                        <div className='label'>{d.text}</div>
                    </div>
                </div>
            ));

            return (
                <div className='chart'>
                    <div className='plot'>{bars}</div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
