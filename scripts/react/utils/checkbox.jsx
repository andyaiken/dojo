/*
<Checkbox
    label="LABEL"
    checked={BOOLEAN}
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
                <div className="checkbox" onClick={e => this.click(e)}>
                    <img className="image" src={this.props.checked ? "content/checked.svg" : "content/unchecked.svg"} />
                    <div className="checkbox-label">{this.props.label}</div>
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}