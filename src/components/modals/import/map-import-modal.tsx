import { FileOutlined } from '@ant-design/icons';
import { Col, Row, Upload } from 'antd';
import React from 'react';

import Factory from '../../../utils/factory';
import Utils from '../../../utils/utils';

import { Map } from '../../../models/map';

import NumberSpin from '../../controls/number-spin';
import Textbox from '../../controls/textbox';
import MapPanel from '../../panels/map-panel';
import Note from '../../panels/note';

interface Props {
    map: Map;
}

interface State {
    map: Map;
    imageID: string | null;
    width: number;
    height: number;
}

export default class MapImportModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            map: props.map,
            imageID: null,
            width: 4,
            height: 4
        };
    }

    private readFile(file: File) {
        const reader = new FileReader();
        reader.onload = progress => {
            if (progress.target) {
                const content = progress.target.result as string;

                if (this.state.imageID) {
                    // Remove previous image from localStorage
                    localStorage.removeItem('image-' + this.state.imageID);
                }

                const image = {
                    id: Utils.guid(),
                    name:  file.name,
                    data: content
                };
                const json = JSON.stringify(image);
                localStorage.setItem('image-' + image.id, json);

                this.setState({
                    imageID: image.id
                }, () => {
                    this.updateMap(image.name);
                });
            }
        };
        reader.readAsDataURL(file);
        return false;
    }

    private nudgeWidth(delta: number) {
        const val = Math.max(0, this.state.width + delta);
        this.setState({
            width: val
        }, () => {
            this.updateMap(null);
        });
    }

    private nudgeHeight(delta: number) {
        const val = Math.max(0, this.state.height + delta);
        this.setState({
            height: val
        }, () => {
            this.updateMap(null);
        });
    }

    private updateMap(name: string | null) {
        const map = this.state.map;
        if (name) {
            map.name = name;
        }
        if (this.state.imageID) {
            const tile = Factory.createMapItem();
            tile.type = 'tile';
            tile.terrain = 'custom';
            tile.customBackground = this.state.imageID;
            tile.width = this.state.width;
            tile.height = this.state.height;

            map.items = [tile];
        } else {
            map.items = [];
        }

        this.setState({
            map: map
        });
    }

    public render() {
        try {
            let content = null;
            if (this.state.imageID) {
                content = (
                    <div>
                        <Note>
                            <div className='section'>
                                set the name and dimensions of this map image
                            </div>
                        </Note>
                        <div className='subheading'>map name</div>
                        <Textbox
                            text={this.state.map.name}
                            placeholder='map name'
                            onChange={value => this.updateMap(value)}
                        />
                        <div className='subheading'>size</div>
                        <NumberSpin
                            source={this.state}
                            name='width'
                            label='width'
                            onNudgeValue={delta => this.nudgeWidth(delta)}
                            onFormatValue={value => value + ' sq'}
                        />
                        <NumberSpin
                            source={this.state}
                            name='height'
                            label='height'
                            onNudgeValue={delta => this.nudgeHeight(delta)}
                            onFormatValue={value => value + ' sq'}
                        />
                    </div>
                );
            } else {
                content = (
                    <div>
                        <Note>
                            <div className='section'>
                                select the file you want to upload
                            </div>
                        </Note>
                        <Upload.Dragger accept='image/*' showUploadList={false} beforeUpload={file => this.readFile(file)}>
                            <p className='ant-upload-drag-icon'>
                                <FileOutlined />
                            </p>
                            <p className='ant-upload-text'>
                                click here, or drag a file here, to upload it
                            </p>
                        </Upload.Dragger>
                    </div>
                );
            }

            return (
                <Row className='full-height'>
                    <Col span={8} className='scrollable'>
                        {content}
                    </Col>
                    <Col span={16} className='scrollable both-ways'>
                        <MapPanel
                            map={this.state.map}
                            mode='edit'
                            size={50}
                        />
                    </Col>
                </Row>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
