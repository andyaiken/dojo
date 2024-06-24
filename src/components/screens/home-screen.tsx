import { Carousel, Row } from 'antd';
import React from 'react';

import { RenderError } from '../error';

interface Props {
}

export class HomeScreen extends React.Component<Props> {
	public render() {
		try {
			const carousel = (
				<Carousel autoplay={true} autoplaySpeed={10 * 1000}>
					<div key='prologue'>
						<div className='heading'>
							welcome to <span className='app-name'>dojo</span>
						</div>
						<div className='section'>
							<span className='app-name'>dojo</span> is an app for dms of <a href='https://www.wizards.com/dnd' target='_blank' rel='noopener noreferrer'>dungeons and dragons fifth edition</a>
						</div>
						<div className='section'>
							with <span className='app-name'>dojo</span> you can...
						</div>
					</div>
					<div key='monster'>
						<div className='heading'>
							build unique, challenging monsters
						</div>
						<ul>
							<li>watch the stat block change as you design your monster</li>
							<li>build an entirely random monster with a single click</li>
							<li>easily import any monster from <a href='https://dnd.wizards.com/articles/features/basicrules' target='_blank' rel='noopener noreferrer'>the basic rules</a> or from <a href='https://www.dndbeyond.com' target='_blank' rel='noopener noreferrer'>d&amp;d beyond</a></li>
							<li>apply a theme to your monster to make it extra unique</li>
							<li>use legendary and mythic monsters</li>
						</ul>
					</div>
					<div key='encounter'>
						<div className='heading'>
							create rewarding encounters
						</div>
						<ul>
							<li>quickly add monsters to your encounter and see its difficulty level change</li>
							<li>add themes to your monsters to make them more unique</li>
							<li>split your encounter into multiple waves</li>
							<li>set specific victory conditions</li>
							<li>let <span className='app-name'>dojo</span> build a random encounter on the fly - or use one of its encounter templates to get started</li>
						</ul>
					</div>
					<div key='map'>
						<div className='heading'>
							design intricate tactical maps
						</div>
						<ul>
							<li>create a dungeon map by quickly adding rooms, doors, corridors, and stairs</li>
							<li>for something a little more fancy, you can upload your own battlemap images - even animated images</li>
							<li>generate an entire random dungeon map with one click</li>
							<li>add fog of war and then show your maps to your players</li>
						</ul>
					</div>
					<div key='combat'>
						<div className='heading'>
							run combat without the book-keeping
						</div>
						<ul>
							<li>see the initiative list at a glance - and share it with players in a separate window</li>
							<li>track monster hit points, rechargable actions, and legendary actions</li>
							<li>track conditions, their durations, and the effects they impose</li>
							<li>easily handle mounted combat</li>
							<li>keep track of everyone&apos;s location, if you&apos;re using a tactical map</li>
						</ul>
					</div>
					<div key='adventure'>
						<div className='heading'>
							devise adventures
						</div>
						<ul>
							<li>keep track of all the information you need to run an adventure</li>
							<li>see the structure of a scenario as a flow chart - or as a map if you&apos;re running a dungeon delve</li>
							<li>add encounters and check their difficulty for your pcs</li>
							<li>keep handouts ready to show to your players</li>
							<li>generate an entire dungeon delve with a single click</li>
						</ul>
					</div>
					<div key='dm-screen'>
						<div className='heading'>
							keep on top of things
						</div>
						<ul>
							<li>check references for skill usage, condition effects, and action rules</li>
							<li>see your party&apos;s passive skills, known languages, and darkvision ranges</li>
							<li>come up with npc names and descriptions, place names, and descriptions of potions or art objects</li>
						</ul>
					</div>
					<div key='epilogue'>
						<div className='heading'>
							to get started
						</div>
						<div className='section'>
							use the buttons at the bottom of this screen to explore <span className='app-name'>dojo</span>&apos;s main features
						</div>
						<div className='section'>
							the arrow at the top right gives you additional tools like a die roller and a handout manager
						</div>
					</div>
				</Carousel>
			);

			return (
				<Row align='middle' justify='center' className='full-height'>
					{carousel}
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='HomeScreen' error={e} />;
		}
	}
}
