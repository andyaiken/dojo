import { FileOutlined } from '@ant-design/icons';
import { Input, Upload } from 'antd';
import React from 'react';

import Sherlock from '../../utils/sherlock';
import Utils from '../../utils/utils';

import { Map } from '../../models/map';
import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import Note from '../panels/note';

interface Props {
    parties: Party[];
    library: MonsterGroup[];
    maps: Map[];
    select: (id: string) => void;
    cancel: () => void;
}

interface State {
    images: SavedImage[];
    filter: string;
}

interface SavedImage {
    id: string;
    name: string;
    data: string;
}

export default class ImageSelectionModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            images: this.listImages(),
            filter: ''
        };
    }

    private listImages() {
        const images: SavedImage[] = [];
        for (let n = 0; n !== localStorage.length; ++n) {
            const key = localStorage.key(n);
            if (key && key.startsWith('image-')) {
                const data = localStorage.getItem(key);
                if (data) {
                    const img = JSON.parse(data);
                    images.push({
                        id: img.id,
                        name: img.name,
                        data: img.data
                    });
                }
            }
        }

        return Utils.sort(images, [{ field: 'name', dir: 'asc'}]);
    }

    private setFilter(text: string) {
        this.setState({
            filter: text
        });
    }

    private readFile(file: File) {
        const reader = new FileReader();
        reader.onload = progress => {
            if (progress.target) {
                const content = progress.target.result as string;
                const image = {
                    id: Utils.guid(),
                    name:  file.name,
                    data: content
                };

                const json = JSON.stringify(image);
                localStorage.setItem('image-' + image.id, json);

                this.setState({
                    images: this.listImages()
                });
            }
        };
        reader.readAsDataURL(file);
        return false;
    }

    private delete(id: string) {
        localStorage.removeItem('image-' + id);

        this.setState({
            images: this.listImages()
        });
    }

    public render() {
        try {
            const images = this.state.images
                .filter(img => Sherlock.match(this.state.filter, img.name))
                .map(img => {
                    // Work out if the image is used in a PC, a monster, or a map tile
                    let used = false;
                    this.props.parties.forEach(party => {
                        if (party.pcs.find(pc => pc.portrait === img.id)) {
                            used = true;
                        }
                    });
                    this.props.library.forEach(group => {
                        if (group.monsters.find(monster => monster.portrait === img.id)) {
                            used = true;
                        }
                    });
                    this.props.maps.forEach(map => {
                        if (map.items.find(mi => mi.customBackground === img.id)) {
                            used = true;
                        }
                    });

                    let deleteBtn = null;
                    if (!used) {
                        deleteBtn = (
                            <button onClick={() => this.delete(img.id)}>delete this image</button>
                        );
                    }

                    return (
                        <div key={img.id} className='group-panel'>
                            <div className='subheading'>{img.name}</div>
                            <img className='section selectable-image' src={img.data} alt={img.name} onClick={() => this.props.select(img.id)} />
                            {deleteBtn}
                        </div>
                    );
                });

            if (images.length === 0) {
                images.push(
                    <Note key='empty'>no images</Note>
                );
            }

            if (this.state.images.length > 0) {
                images.unshift(
                    <Input.Search
                        key='search'
                        value={this.state.filter}
                        placeholder='search for an image'
                        allowClear={true}
                        onChange={e => this.setFilter(e.target.value)}
                        onSearch={value => this.setFilter(value)}
                    />
                );
            }

            return (
                <div className='full-height'>
                    <div className='drawer-header'><div className='app-title'>select image</div></div>
                    <div className='drawer-content'>
                        <div className='scrollable'>
                            <div>
                                <Upload.Dragger accept='image/*' showUploadList={false} beforeUpload={file => this.readFile(file)}>
                                    <p className='ant-upload-drag-icon'>
                                        <FileOutlined />
                                    </p>
                                    <p className='ant-upload-text'>
                                        click here, or drag a file here, to upload it
                                    </p>
                                </Upload.Dragger>
                            </div>
                            {images}
                        </div>
                    </div>
                    <div className='drawer-footer'>
                        <button onClick={() => this.props.cancel()}>cancel</button>
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
