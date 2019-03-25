import React from 'react';

import minus from '../../resources/images/minus.svg';
import plus from '../../resources/images/plus.svg';

interface Props {
    source: any;
    name: string;
    nudgeValue: (delta: number) => void;
    label: string;
    disabled: boolean;
    factors: number[];
    display: ((value: number) => string) | null;
}

export default class Spin extends React.Component<Props> {
    public static defaultProps = {
        label: null,
        disabled: false,
        factors: null,
        display: null
    };

    private click(e: React.MouseEvent, delta: number) {
        e.stopPropagation();
        this.props.nudgeValue(delta);
    }

    private touchEnd(e: React.TouchEvent, delta: number) {
        e.preventDefault();
        e.stopPropagation();
        this.props.nudgeValue(delta);
    }

    public render() {
        try {
            let style = 'info-value';
            let value = this.props.source[this.props.name];
            if (value === 0) {
                style += ' dimmed';
            }

            if (this.props.display) {
                value = this.props.display(value);
            }

            const minusBtns: JSX.Element[] = [];
            const plusBtns: JSX.Element[] = [];

            if (this.props.factors) {
                this.props.factors.forEach(factor => {
                    minusBtns.push(
                        <div
                            key={'minus' + factor}
                            className='spin-button factor'
                            onTouchEnd={e => this.touchEnd(e, -1 * factor)}
                            onClick={e => this.click(e, -1 * factor)}
                        >
                            {'-' + factor}
                        </div>
                    );

                    plusBtns.push(
                        <div
                            key={'plus' + factor}
                            className='spin-button factor'
                            onTouchEnd={e => this.touchEnd(e, +1 * factor)}
                            onClick={e => this.click(e, +1 * factor)}
                        >
                            {'+' + factor}
                        </div>
                    );
                });

                minusBtns.reverse();
            } else {
                minusBtns.push(
                    <div key='minus1' className='spin-button' onTouchEnd={e => this.touchEnd(e, -1)} onClick={e => this.click(e, -1)}>
                        <img className='image' src={minus} alt='minus' />
                    </div>
                );

                plusBtns.push(
                    <div key='plus1' className='spin-button' onTouchEnd={e => this.touchEnd(e, +1)} onClick={e => this.click(e, +1)}>
                        <img className='image' src={plus} alt='plus' />
                    </div>
                );
            }

            const infoWidth = 80 * (this.props.factors ? this.props.factors.length : 1);

            return (
                <div className={this.props.disabled ? 'spin disabled' : 'spin'}>
                    <div className='minus'>
                        {minusBtns}
                    </div>
                    <div className='info' style={{ width: 'calc(100% - ' + infoWidth + 'px)' }}>
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
            return null;
        }
    }
}
