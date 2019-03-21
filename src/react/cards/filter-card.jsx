import React from 'react';
import * as utils from '../../utils';
import Spin from '../controls/spin';
import Dropdown from '../controls/dropdown';

import arrow from "../../resources/images/down-arrow.svg";

export default class FilterCard extends React.Component {
    constructor() {
        super();
        this.state = {
            showAll: false
        };
    }

    toggleAll() {
        this.setState({
            showAll: !this.state.showAll
        })
    }

    render() {
        try {
            var sizes = ["all sizes"].concat(utils.SIZE_TYPES);
            var sizeOptions = sizes.map(size => { return { id: size, text: size }; });
            
            var categories = ["all types"].concat(utils.CATEGORY_TYPES);
            var catOptions = categories.map(cat => { return { id: cat, text: cat }; });

            var content = null;
            if (this.state.showAll) {
                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="name" value={this.props.filter.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <Spin
                            source={this.props.filter}
                            name="challengeMin"
                            label="min cr"
                            display={value => utils.challenge(value)}
                            nudgeValue={delta => this.props.nudgeValue("challengeMin", delta)}
                        />
                        <Spin
                            source={this.props.filter}
                            name="challengeMax"
                            label="max cr"
                            display={value => utils.challenge(value)}
                            nudgeValue={delta => this.props.nudgeValue("challengeMax", delta)}
                        />
                        <Dropdown
                            options={sizeOptions}
                            placeholder="filter by size..."
                            selectedID={this.props.filter.size}
                            select={optionID => this.props.changeValue("size", optionID)}
                        />
                        <Dropdown
                            options={catOptions}
                            placeholder="filter by type..."
                            selectedID={this.props.filter.category}
                            select={optionID => this.props.changeValue("category", optionID)}
                        />
                        <div className="divider"></div>
                        <div className="section">
                            <button onClick={() => this.props.resetFilter()}>clear filter</button>
                        </div>
                    </div>
                );
            } else {
                var summary = "";
                if (this.props.filter.size !== "all sizes") {
                    summary += summary ? " " + this.props.filter.size : this.props.filter.size;
                }
                if (this.props.filter.category !== "all types") {
                    summary += summary ? " " + this.props.filter.category : this.props.filter.category;
                }
                summary += " monsters of cr " + utils.challenge(this.props.filter.challengeMin) + " to " + utils.challenge(this.props.filter.challengeMax);

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="name" value={this.props.filter.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div className="section">showing {summary}</div>
                    </div>
                );
            }

            return (
                <div className="card">
                    <div className="heading">
                        <div className="title">filter</div>
                        <img className={this.state.showAll ? "image rotate" : "image"} src={arrow} alt="arrow" onClick={() => this.toggleAll()} />
                    </div>
                    <div className="card-content">
                        {content}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}