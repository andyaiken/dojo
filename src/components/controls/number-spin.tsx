import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
    source: any;
    name: string;
    label: string;
    disabled: boolean;
    factors: number[];
    onNudgeValue: (delta: number) => void;
    onFormatValue: (value: number) => string;
}

export default class NumberSpin extends React.Component<Props> {
    public static defaultProps = {
        label: null,
        disabled: false,
        factors: null,
        onFormatValue: null
    };

    private click(e: React.MouseEvent, delta: number) {
        e.stopPropagation();
        this.props.onNudgeValue(delta);
    }

    private touchEnd(e: React.TouchEvent, delta: number) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onNudgeValue(delta);
    }

    public render() {
        try {
            let style = 'info-value';
            let value = this.props.source[this.props.name];
            if (value === 0) {
                style += ' dimmed';
            }

            if (this.props.onFormatValue) {
                value = this.props.onFormatValue(value);
            }

            const minusBtns: JSX.Element[] = [];
            const plusBtns: JSX.Element[] = [];

            const factors = this.props.factors || [1];
            factors.forEach(factor => {
                minusBtns.push(
                    <div
                        key={'minus' + factor}
                        className={factor === 1 ? 'spin-button' : 'spin-button multiple'}
                        onTouchEnd={e => this.touchEnd(e, -1 * factor)}
                        onClick={e => this.click(e, -1 * factor)}
                    >
                        {factor === 1 ? <MinusOutlined /> : <div>{factor}</div>}
                    </div>
                );

                plusBtns.push(
                    <div
                        key={'plus' + factor}
                        className={factor === 1 ? 'spin-button' : 'spin-button multiple'}
                        onTouchEnd={e => this.touchEnd(e, +1 * factor)}
                        onClick={e => this.click(e, +1 * factor)}
                    >
                        {factor === 1 ? <PlusOutlined /> : <div>{factor}</div>}
                    </div>
                );
            });

            minusBtns.reverse();

            return (
                <div className={this.props.disabled ? 'number-spin disabled' : 'number-spin'}>
                    <div className='minus'>
                        {minusBtns}
                    </div>
                    <div className='info' style={{ width: 'calc(100% - ' + (60 * factors.length) + 'px)' }}>
                        <div className='info-label'>{this.props.label}</div>
                        <div className={style}>{value}</div>
                    </div>
                    <div className='plus'>
                        {plusBtns}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
