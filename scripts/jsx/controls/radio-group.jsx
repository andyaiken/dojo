/*
<RadioGroup
    items={[{id, text, details, disabled}]}
    selectedItemID="0"
    select={itemID => null}
/>
*/

class RadioGroup extends React.Component {
    render() {
        try {
            var content = this.props.items.map(item => {
                return (
                    <RadioGroupItem
                        item={item}
                        selected={this.props.selectedItemID === item.id}
                        select={itemID => this.props.select(itemID)}
                    />
                );
            });

            return (
                <div className="radio-group">
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}

class RadioGroupItem extends React.Component {
    render() {
        var style = "radio-item";
        var details = null;

        if (this.props.selected) {
            style += " selected";
            details = (
                <div className="radio-item-details">
                    {this.props.item.details}
                </div>
            );
        }

        if (this.props.item.disabled) {
            style += " disabled";
        }

        return (
            <div className={style} onClick={() => this.props.select(this.props.item.id)}>
                <div className="radio-item-text">{this.props.item.text}</div>
                {details}
            </div>
        );
    }
}