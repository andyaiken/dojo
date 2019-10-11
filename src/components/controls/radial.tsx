import React from 'react';

interface Props {
    click: (dir: string, dir2: 'in' | 'out' | null) => void;
    direction: 'out' | 'in' | 'both' | 'eight';
    disabled: boolean;
}

export default class Radial extends React.Component<Props> {
    public static defaultProps = {
        direction: 'out',
        disabled: false
    };

    private click(e: React.MouseEvent, dir: string, dir2: 'in' | 'out' | null = null) {
        e.stopPropagation();
        this.props.click(dir, dir2);
    }

    public render() {
        try {
            let style = 'radial ' + (this.props.direction || 'out');
            if (this.props.disabled) {
                style += ' disabled';
            }

            const showOut = (this.props.direction === 'out') || (this.props.direction === 'both') || (this.props.direction === 'eight');
            const showIn = (this.props.direction === 'in') || (this.props.direction === 'both');
            const showDiag = (this.props.direction === 'eight');

            return (
                <div className={style}>
                    <div className='cell' style={{ display: showDiag ? 'none' : 'inline-block' }} />
                    <div className='cell' style={{ display: showDiag ? 'inline-block' : 'none' }}>
                        <div className='arrow diag' style={{ display: showOut ? 'block' : 'none' }} onClick={e => this.click(e, 'NW')}>
                            &#8598;
                        </div>
                    </div>
                    <div className='cell'>
                        <div className='arrow vertical' style={{ display: showOut ? 'block' : 'none' }} onClick={e => this.click(e, 'N', 'out')}>
                            &#8593;
                        </div>
                        <div className='arrow vertical' style={{ display: showIn ? 'block' : 'none' }} onClick={e => this.click(e, 'N', 'in')}>
                            &#8595;
                        </div>
                    </div>
                    <div className='cell' style={{ display: showDiag ? 'none' : 'inline-block' }} />
                    <div className='cell' style={{ display: showDiag ? 'inline-block' : 'none' }}>
                        <div className='arrow diag' style={{ display: showOut ? 'block' : 'none' }} onClick={e => this.click(e, 'NE')}>
                            &#8599;
                        </div>
                    </div>
                    <div className='cell'>
                        <div className='arrow horizontal' style={{ display: showOut ? 'inline-block' : 'none' }} onClick={e => this.click(e, 'W', 'out')}>
                            &#8592;
                        </div>
                        <div className='arrow horizontal' style={{ display: showIn ? 'inline-block' : 'none' }} onClick={e => this.click(e, 'W', 'in')}>
                            &#8594;
                        </div>
                    </div>
                    <div className='cell' />
                    <div className='cell'>
                        <div className='arrow horizontal' style={{ display: showIn ? 'inline-block' : 'none' }} onClick={e => this.click(e, 'E', 'in')}>
                            &#8592;
                        </div>
                        <div className='arrow horizontal' style={{ display: showOut ? 'inline-block' : 'none' }} onClick={e => this.click(e, 'E', 'out')}>
                            &#8594;
                        </div>
                    </div>
                    <div className='cell' style={{ display: showDiag ? 'none' : 'inline-block' }} />
                    <div className='cell' style={{ display: showDiag ? 'inline-block' : 'none' }}>
                        <div className='arrow diag' style={{ display: showOut ? 'block' : 'none' }} onClick={e => this.click(e, 'SW')}>
                            &#8601;
                        </div>
                    </div>
                    <div className='cell'>
                        <div className='arrow vertical' style={{ display: showIn ? 'block' : 'none' }} onClick={e => this.click(e, 'S', 'in')}>
                            &#8593;
                        </div>
                        <div className='arrow vertical' style={{ display: showOut ? 'block' : 'none' }} onClick={e => this.click(e, 'S', 'out')}>
                            &#8595;
                        </div>
                    </div>
                    <div className='cell' style={{ display: showDiag ? 'none' : 'inline-block' }} />
                    <div className='cell' style={{ display: showDiag ? 'inline-block' : 'none' }}>
                        <div className='arrow diag' style={{ display: showOut ? 'block' : 'none' }} onClick={e => this.click(e, 'SE', 'out')}>
                            &#8600;
                        </div>
                    </div>
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
