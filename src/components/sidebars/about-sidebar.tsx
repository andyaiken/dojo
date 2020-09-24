import { Col, Row } from 'antd';
import React from 'react';

import { Matisse } from '../../utils/matisse';
import { Utils } from '../../utils/utils';

import { Combat } from '../../models/combat';
import { Exploration, Map } from '../../models/map';
import { Options } from '../../models/misc';
import { MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import { Checkbox } from '../controls/checkbox';
import { Selector } from '../controls/selector';
import { Note } from '../panels/note';

import pkg from '../../../package.json';

interface Props {
	parties: Party[];
	library: MonsterGroup[];
	maps: Map[];
	combats: Combat[];
	explorations: Exploration[];
	options: Options;
	setOption: (option: string, value: any) => void;
}

interface State {
	view: string;
}

export class AboutSidebar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			view: 'dojo'
		};
	}

	private setView(view: string) {
		this.setState({
			view: view
		});
	}

	private clearImages() {
		Matisse.clearUnusedImages(this.props.maps, this.props.combats, this.props.explorations);

		this.setState({
			view: this.state.view
		});
	}

	public render() {
		try {
			const options = ['dojo', 'settings', 'ogl'].map(o => ({ id: o, text: o}));

			let content = null;
			switch (this.state.view) {
				case 'dojo':
					content = (
						<div>
							<div className='section'>
								designed by <a href='mailto:andy.aiken@live.co.uk'>andy aiken</a>
							</div>
							<div className='section'>
								version <b>{pkg.version}</b>
							</div>
							<div className='section'>
								if you would like to raise a bug or request a new feature, you can do so <a href='https://github.com/andyaiken/dojo' target='_blank' rel='noopener noreferrer'>here</a>
							</div>
							<div className='section'>
								the roadmap for planned new features can be found <a href='https://github.com/andyaiken/dojo/projects/8?fullscreen=true' target='_blank' rel='noopener noreferrer'>here</a>
							</div>
						</div>
					);
					break;
				case 'settings':
					let data = 0;
					let images = 0;
					for (let n = 0; n !== window.localStorage.length; ++n) {
						const key = window.localStorage.key(n);
						if (key) {
							const value = window.localStorage.getItem(key);
							if (value) {
								if (key.startsWith('data')) {
									data += value.length;
								}
								if (key.startsWith('image')) {
									images += value.length;
								}
							}
						}
					}
					content = (
						<div>
							<Note>
							<div className='section'>
									turn this setting on to add die roll buttons to monster stat blocks
								</div>
							</Note>
							<Checkbox
								label='show monster die rolls'
								checked={this.props.options.showMonsterDieRolls}
								onChecked={checked => this.props.setOption('showMonsterDieRolls', checked)}
							/>
							<Note>
								<div className='section'>
									the browser has a limited amount of image storage space
								</div>
								<div className='section'>
									use this button to delete anything that isn't currently being used
								</div>
							</Note>
							<button onClick={() => this.clearImages()}>remove unused images</button>
							<hr/>
							<div className='subheading'>
								data
							</div>
							<div className='section'>
								<Row>
									<Col span={16}>total</Col>
									<Col span={8} className='statistic-value'>{Utils.toData(data + images)}</Col>
								</Row>
								<Row>
									<Col span={16}>data</Col>
									<Col span={8} className='statistic-value'>{Utils.toData(data)}</Col>
								</Row>
								<Row>
									<Col span={16}>images</Col>
									<Col span={8} className='statistic-value'>{Utils.toData(images)}</Col>
								</Row>
							</div>
						</div>
					);
					break;
				case 'ogl':
					/* tslint:disable:max-line-length */
					content = (
						<div>
							<div className='subheading'>
								open game license
							</div>
							<div className='section'>
								The following text is the property of Wizards of the Coast, Inc. and is Copyright 2000 Wizards of the Coast, Inc ('Wizards'). All Rights Reserved.
							</div>
							<ol>
								<li><b>Definitions</b>: (a)'Contributors' means the copyright and/or trademark owners who have contributed Open Game Content; (b)'Derivative Material' means copyrighted material including derivative works and translations (including into other computer languages), potation, modification, correction, addition, extension, upgrade, improvement, compilation, abridgment or other form in which an existing work may be recast, transformed or adapted; (c) 'Distribute' means to reproduce, license, rent, lease, sell, broadcast, publicly display, transmit or otherwise distribute; (d)'Open Game Content' means the game mechanic and includes the methods, procedures, processes and routines to the extent such content does not embody the Product Identity and is an enhancement over the prior art and any additional content clearly identified as Open Game Content by the Contributor, and means any work covered by this License, including translations and derivative works under copyright law, but specifically excludes Product Identity. (e) 'Product Identity' means product and product line names, logos and identifying marks including trade dress; artifacts; creatures characters; stories, storylines, plots, thematic elements, dialogue, incidents, language, artwork, symbols, designs, depictions, likenesses, formats, poses, concepts, themes and graphic, photographic and other visual or audio representations; names and descriptions of characters, spells, enchantments, personalities, teams, personas, likenesses and special abilities; places, locations, environments, creatures, equipment, magical or supernatural abilities or effects, logos, symbols, or graphic designs; and any other trademark or registered trademark clearly identified as Product identity by the owner of the Product Identity, and which specifically excludes the Open Game Content; (f) 'Trademark' means the logos, names, mark, sign, motto, designs that are used by a Contributor to identify itself or its products or the associated products contributed to the Open Game License by the Contributor (g) 'Use', 'Used' or 'Using' means to use, Distribute, copy, edit, format, modify, translate and otherwise create Derivative Material of Open Game Content. (h) 'You' or 'Your' means the licensee in terms of this agreement.</li>
								<li><b>The License</b>: This License applies to any Open Game Content that contains a notice indicating that the Open Game Content may only be Used under and in terms of this License. You must affix such a notice to any Open Game Content that you Use. No terms may be added to or subtracted from this License except as described by the License itself. No other terms or conditions may be applied to any Open Game Content distributed using this License.</li>
								<li><b>Offer and Acceptance</b>: By Using the Open Game Content You indicate Your acceptance of the terms of this License.</li>
								<li><b>Grant and Consideration</b>: In consideration for agreeing to use this License, the Contributors grant You a perpetual, worldwide, royalty-free, non-exclusive license with the exact terms of this License to Use, the Open Game Content.</li>
								<li><b>Representation of Authority to Contribute</b>: If You are contributing original material as Open Game Content, You represent that Your Contributions are Your original creation and/or You have sufficient rights to grant the rights conveyed by this License.</li>
								<li><b>Notice of License Copyright</b>: You must update the COPYRIGHT NOTICE portion of this License to include the exact text of the COPYRIGHT NOTICE of any Open Game Content You are copying, modifying or distributing, and You must add the title, the copyright date, and the copyright holder's name to the COPYRIGHT NOTICE of any original Open Game Content you Distribute.</li>
								<li><b>Use of Product Identity</b>: You agree not to Use any Product Identity, including as an indication as to compatibility, except as expressly licensed in another, independent Agreement with the owner of each element of that Product Identity. You agree not to indicate compatibility or co-adaptability with any Trademark or Registered Trademark in conjunction with a work containing Open Game Content except as expressly licensed in another, independent Agreement with the owner of such Trademark or Registered Trademark. The use of any Product Identity in Open Game Content does not constitute a challenge to the ownership of that Product Identity. The owner of any Product Identity used in Open Game Content shall retain all rights, title and interest in and to that Product Identity.</li>
								<li><b>Identification</b>: If you distribute Open Game Content You must clearly indicate which portions of the work that you are distributing are Open Game Content.</li>
								<li><b>Updating the License</b>: Wizards or its designated Agents may publish updated versions of this License. You may use any authorized version of this License to copy, modify and distribute any Open Game Content originally distributed under any version of this License.</li>
								<li><b>Copy of this License</b>: You MUST include a copy of this License with every copy of the Open Game Content You Distribute.</li>
								<li><b>Use of Contributor Credits</b>: You may not market or advertise the Open Game Content using the name of any Contributor unless You have written permission from the Contributor to do so.</li>
								<li><b>Inability to Comply</b>: If it is impossible for You to comply with any of the terms of this License with respect to some or all of the Open Game Content due to statute, judicial order, or governmental regulation then You may not Use any Open Game Material so affected.</li>
								<li><b>Termination</b>: This License will terminate automatically if You fail to comply with all terms herein and fail to cure such breach within 30 days of becoming aware of the breach. All sublicenses shall survive the termination of this License.</li>
								<li><b>Reformation</b>: If any provision of this License is held to be unenforceable, such provision shall be reformed only to the extent necessary to make it enforceable.</li>
								<li><b>COPYRIGHT NOTICE</b> Open Game License v 1.0 Copyright 2000, Wizards of the Coast, Inc.</li>
							</ol>
						</div>
					);
					/* tslint:enable:max-line-length */
					break;
			}

			return (
				<div className='sidebar-container'>
					<div className='sidebar-header'>
						<div className='heading'>about</div>
						<Selector options={options} selectedID={this.state.view} onSelect={id => this.setView(id)} />
					</div>
					<div className='sidebar-content'>
						{content}
					</div>
				</div>
			);
		} catch (ex) {
			console.error(ex);
			return <div className='render-error'/>;
		}
	}
}
