/*
<Checkbox
    label="LABEL"
    checked={BOOLEAN}
    disabled={BOOLEAN}
    changeValue={value => this.changeValue(SOURCEOBJECT, FIELDNAME, value)}
/>
*/

class Checkbox extends React.Component {
    click(e) {
        e.stopPropagation();
        this.props.changeValue(!this.props.checked);
    }

    render() {
        try {
            return (
                <div className={this.props.disabled ? "checkbox disabled" : "checkbox"} onClick={e => this.click(e)}>
                    <img className="image" src={this.props.checked ? "resources/images/checked.svg" : "resources/images/unchecked.svg"} />
                    <div className="checkbox-label">{this.props.label}</div>
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}