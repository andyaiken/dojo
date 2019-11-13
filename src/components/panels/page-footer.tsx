import React from 'react';

interface Props {
    view: string;
    setView: (view: string) => void;
}

export default class PageFooter extends React.Component<Props> {
    public render() {
        try {
            const partiesStyle = this.props.view === 'parties' ? 'navigator-item pcs selected' : 'navigator-item pcs';
            const libraryStyle = this.props.view === 'library' ? 'navigator-item monsters selected' : 'navigator-item monsters';
            const encounterStyle = this.props.view === 'encounters' ? 'navigator-item encounters selected' : 'navigator-item encounters';
            const mapStyle = this.props.view === 'maps' ? 'navigator-item maps selected' : 'navigator-item maps';
            const combatStyle = this.props.view === 'combat' ? 'navigator-item combat selected' : 'navigator-item combat';

            return (
                <div className='page-footer'>
                    <div className={partiesStyle} onClick={() => this.props.setView('parties')}>pcs</div>
                    <div className={libraryStyle} onClick={() => this.props.setView('library')}>monsters</div>
                    <div className={encounterStyle} onClick={() => this.props.setView('encounters')}>encounters</div>
                    <div className={mapStyle} onClick={() => this.props.setView('maps')}>maps</div>
                    <div className={combatStyle} onClick={() => this.props.setView('combat')}>combat</div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
