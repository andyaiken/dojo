class DropdownItem extends React.Component {
    onSelect(item) {
        this.props.onSelect(item);
    }

    render() {
        try {
            var style = this.props.selected ? "dropdown-item selected" : "dropdown-item";
            return (
                <div className={style} onClick={() => this.onSelect(this.props.item)}>
                    {this.props.text}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}