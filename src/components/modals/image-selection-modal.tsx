import { Input } from 'antd';
import React from 'react';

import Sherlock from '../../utils/sherlock';
import Utils from '../../utils/utils';

import Note from '../panels/note';

interface Props {
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

    private onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
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
            const file = e.target.files[0];
            reader.readAsDataURL(file);
        }
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
                .map(img => (
                    <div key={img.id}>
                        <div className='subheading'>{img.name}</div>
                        <img className='selectable-image' src={img.data} alt={img.name} onClick={() => this.props.select(img.id)} />
                        <button onClick={() => this.delete(img.id)}>delete this image</button>
                    </div>
                ));

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
                            <button onClick={() => (document.getElementById('file-upload') as HTMLElement).click()}>add a new image</button>
                            <input
                                type='file'
                                id='file-upload'
                                accept='image/*'
                                style={{ display: 'none' }}
                                onChange={e => this.onFileSelected(e)}
                            />
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
