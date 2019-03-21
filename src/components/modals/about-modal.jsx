import React from 'react';

import ConfirmButton from '../controls/confirm-button';
import Checkbox from '../controls/checkbox';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import Spin from '../controls/spin';
import Selector from '../controls/selector';

export default class AboutModal extends React.Component {
    constructor() {
        super();

        this.state = {
            showDev: false,
            optionID: "abc",
            value: 0,
            selected: false
        };
    }

    setOption(optionID) {
        this.setState({
            optionID: optionID
        });
    }

    setValue(value) {
        this.setState({
            value: value
        });
    }

    setSelected(selected) {
        this.setState({
            selected: selected
        });
    }

    getDevSection() {
        if (this.state.showDev) {
            var devOptions = ["abc", "def", "ghi", "jkl"].map(x => {
                return {
                    id: x,
                    text: x
                };
            });

            return (
                <div className="row">
                    <div className="columns small-6 medium-6 large-6 end">
                        <div className="heading">dev</div>
                        <button onClick={() => this.setSelected(!this.state.selected)}>button</button>
                        <ConfirmButton
                            text="confirm"
                            callback={() => this.setSelected(!this.state.selected)}
                        />
                        <Checkbox
                            label="checkbox"
                            checked={this.state.selected}
                            changeValue={value => this.setSelected(value)}
                        />
                        <Dropdown
                            options={devOptions}
                            selectedID={this.state.optionID}
                            select={optionID => this.setOption(optionID)}
                        />
                        <Expander
                            text="expander"
                            content={<div>content</div>}
                        />
                        <Spin
                            source={this.state}
                            name="value"
                            label="value"
                            factors={[1, 10, 100]}
                            nudgeValue={delta => this.setValue(this.state.value + delta)}
                        />
                        <Selector
                            tabs={true}
                            options={devOptions}
                            selectedID={this.state.optionID}
                            select={optionID => this.setOption(optionID)}
                        />
                        <Selector
                            tabs={false}
                            options={devOptions}
                            selectedID={this.state.optionID}
                            select={optionID => this.setOption(optionID)}
                        />
                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        try {
            return (
                <div className="about">
                    <div className="row">
                        <div className="columns small-6 medium-6 large-6 list-column">
                            <div className="heading">about</div>
                            <div className="section">dojo by <a href="mailto:andy.aiken@live.co.uk">andy aiken</a></div>
                            <div className="section">if you would like to contribut to this project, you can do so <a href="https://github.com/andyaiken/dojo" target="_blank" rel="noopener noreferrer">here</a></div>
                            <div className="section">dungeons and dragons copyright wizards of the coast</div>
                        </div>
                        <div className="columns small-6 medium-6 large-6 list-column">
                            <div className="heading">options</div>
                            <ConfirmButton text="clear all data" callback={() => this.props.resetAll()} />
                            <Checkbox
                                label="show help cards"
                                checked={this.props.options.showHelp}
                                changeValue={value => this.props.changeValue(this.props.options, "showHelp", value)}
                            />
                        </div>
                    </div>
                    {this.getDevSection()}
                    <div className="row">
                        <div className="columns small-12 medium-12 large-12 list-column">
                            <div className="heading">open game license</div>
                            <div className="section">The following text is the property of Wizards of the Coast, Inc. and is Copyright 2000 Wizards of the Coast, Inc ("Wizards"). All Rights Reserved.</div>
                            <ol>
                                <li>Definitions: (a)"Contributors" means the copyright and/or trademark owners who have contributed Open Game Content; (b)"Derivative Material" means copyrighted material including derivative works and translations (including into other computer languages), potation, modification, correction, addition, extension, upgrade, improvement, compilation, abridgment or other form in which an existing work may be recast, transformed or adapted; (c) "Distribute" means to reproduce, license, rent, lease, sell, broadcast, publicly display, transmit or otherwise distribute; (d)"Open Game Content" means the game mechanic and includes the methods, procedures, processes and routines to the extent such content does not embody the Product Identity and is an enhancement over the prior art and any additional content clearly identified as Open Game Content by the Contributor, and means any work covered by this License, including translations and derivative works under copyright law, but specifically excludes Product Identity. (e) "Product Identity" means product and product line names, logos and identifying marks including trade dress; artifacts; creatures characters; stories, storylines, plots, thematic elements, dialogue, incidents, language, artwork, symbols, designs, depictions, likenesses, formats, poses, concepts, themes and graphic, photographic and other visual or audio representations; names and descriptions of characters, spells, enchantments, personalities, teams, personas, likenesses and special abilities; places, locations, environments, creatures, equipment, magical or supernatural abilities or effects, logos, symbols, or graphic designs; and any other trademark or registered trademark clearly identified as Product identity by the owner of the Product Identity, and which specifically excludes the Open Game Content; (f) "Trademark" means the logos, names, mark, sign, motto, designs that are used by a Contributor to identify itself or its products or the associated products contributed to the Open Game License by the Contributor (g) "Use", "Used" or "Using" means to use, Distribute, copy, edit, format, modify, translate and otherwise create Derivative Material of Open Game Content. (h) "You" or "Your" means the licensee in terms of this agreement.</li>
                                <li>The License: This License applies to any Open Game Content that contains a notice indicating that the Open Game Content may only be Used under and in terms of this License. You must affix such a notice to any Open Game Content that you Use. No terms may be added to or subtracted from this License except as described by the License itself. No other terms or conditions may be applied to any Open Game Content distributed using this License.</li>
                                <li>Offer and Acceptance: By Using the Open Game Content You indicate Your acceptance of the terms of this License.</li>
                                <li>Grant and Consideration: In consideration for agreeing to use this License, the Contributors grant You a perpetual, worldwide, royalty-free, non-exclusive license with the exact terms of this License to Use, the Open Game Content.</li>
                                <li>Representation of Authority to Contribute: If You are contributing original material as Open Game Content, You represent that Your Contributions are Your original creation and/or You have sufficient rights to grant the rights conveyed by this License.</li>
                                <li>Notice of License Copyright: You must update the COPYRIGHT NOTICE portion of this License to include the exact text of the COPYRIGHT NOTICE of any Open Game Content You are copying, modifying or distributing, and You must add the title, the copyright date, and the copyright holder's name to the COPYRIGHT NOTICE of any original Open Game Content you Distribute.</li>
                                <li>Use of Product Identity: You agree not to Use any Product Identity, including as an indication as to compatibility, except as expressly licensed in another, independent Agreement with the owner of each element of that Product Identity. You agree not to indicate compatibility or co-adaptability with any Trademark or Registered Trademark in conjunction with a work containing Open Game Content except as expressly licensed in another, independent Agreement with the owner of such Trademark or Registered Trademark. The use of any Product Identity in Open Game Content does not constitute a challenge to the ownership of that Product Identity. The owner of any Product Identity used in Open Game Content shall retain all rights, title and interest in and to that Product Identity.</li>
                                <li>Identification: If you distribute Open Game Content You must clearly indicate which portions of the work that you are distributing are Open Game Content.</li>
                                <li>Updating the License: Wizards or its designated Agents may publish updated versions of this License. You may use any authorized version of this License to copy, modify and distribute any Open Game Content originally distributed under any version of this License.</li>
                                <li>Copy of this License: You MUST include a copy of this License with every copy of the Open Game Content You Distribute.</li>
                                <li>Use of Contributor Credits: You may not market or advertise the Open Game Content using the name of any Contributor unless You have written permission from the Contributor to do so.</li>
                                <li>Inability to Comply: If it is impossible for You to comply with any of the terms of this License with respect to some or all of the Open Game Content due to statute, judicial order, or governmental regulation then You may not Use any Open Game Material so affected.</li>
                                <li>Termination: This License will terminate automatically if You fail to comply with all terms herein and fail to cure such breach within 30 days of becoming aware of the breach. All sublicenses shall survive the termination of this License.</li>
                                <li>Reformation: If any provision of this License is held to be unenforceable, such provision shall be reformed only to the extent necessary to make it enforceable.</li>
                                <li>COPYRIGHT NOTICE Open Game License v 1.0 Copyright 2000, Wizards of the Coast, Inc.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}