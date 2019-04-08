import React from 'react';

import TextGenerator from '../../utils/text-generation';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

interface State {
    output: string[];
}

export default class NameModule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            output: []
        };
    }

    private data = {
        "male": [
            "Atticus","Augustus","Cassius","Cato","Cyprian","Felix","Julius","Justus","Lucius","Magnus","Marcus","Maximus","Octavius","Philo","Remus","Rufus","Septimus","Tiberius","Urban",
            "Merek","Carac","Ulric","Tybalt","Borin","Sadon","Terrowin","Rowan","Forthwind","Althalos","Fendrel","Brom","Hadrian","Walter","Fenwick","Oliver","Clifton","Walter","Roger","Joseph","Geoffrey","William","Francis","Simon","John","Edmund","Charles","Benedict","Gregory","Peter","Henry","Frederick","Walter","Thomas","Arthur","Bryce","Donald","Leofrick","Letholdus","Lief","Barda","Rulf","Robin","Gavin","Terryn","Ronald","Jarin","Cassius","Leo","Cedric","Gavin","Peyton","Josef","Janshai","Doran","Asher","Quinn","Zane","Xalvador","Favian","Destrian","Dain","Falk","Berinon","Tristan","Gorvenal"
        ],
        "female": [
            "Aeliana","Antonia","Augusta","Aurelia","Camilla","Cassia","Cecilia","Decima","Drusilla","Flavia","Florentina","Junia","Laelia","Laurentia","Livia","Marilla","Octavia","Priscilla","Sabina","Tanaquil","Tatiana","Tullia","Valentina","Vita",
            "Millicent","Alys","Ayleth","Anastas","Alianor","Cedany","Ellyn","Helewys","Malkyn","Peronell","Sybbyl","Ysmay","Thea","Jacquelyn","Amelia","Gloriana","Bess","Catherine","Anne","Mary","Arabella","Elizabeth","Hildegard","Brunhild","Adelaide","Alice","Beatrix","Cristiana","Eleanor","Emeline","Isabel","Juliana","Margaret","Matilda","Mirabelle","Rose","Helena","Guinevere","Isolde","Maerwynn","Muriel","Winifred","Godiva","Catrain","Angmar","Gussalen","Jasmine","Josselyn","Maria","Victoria","Gwendolynn","Enndolynn","Janet","Luanda","Krea","Rainydayas","Atheena","Dimia","Phrowenia","Aleida","Ariana","Alexia","Katelyn","Katrina","Loreena","Kaylein","Seraphina","Duraina","Ryia","Farfelee","Iseult","Benevolence","Brangian"
        ],
        "place": [
            "Roma","Ariminum","Belum","Pompeii","Forum","Genava","Capua","Dyrrachium","Spalatum","Trapezus","Nauportus","Nicomedia","Nicaea","Mediolanum","Barium","Patavium","Nicomedia","Neviodunum","Constantinopolis","Abdera","Aegae","Heraclea","Ithaca","Kallipolis","Neapolis",
            "Aerilon","Aquarin","Aramoor","Azmar","Brickelwhyte","Boatwright","Bullmar","Carran","Coalfell","Cullfield","Darkwell","Deathfall","Doonatel","Easthaven","Ecrin","Erast","Firebend","Frostford","Goldcrest","Goldenleaf","Greenflower","Haran","Hillfar","Hogsfeet","Hollyhead","Hull","Hwen","Icemeet","Ironforge","Irragin","Jongvale","Lakeshore","Leeside","Lullin","Millstone","Moonbright","Mountmend","Nearon","Northpass","Nuxvar","Oakheart","Orrinshire","Ozryn","Pavv","Pran","Queenstown","Ramshorn","Rivermouth","Seameet","Silverkeep","Snowmelt","Swordbreak","Tarrin","Trudid","Veritas","Wavemeet","Whiteridge","Willowdale","Windrip","Wintervale","Wellspring","Westwend","Wolfden","Xynnar","Yarrin","Yellowseed","Zeffari","Zumka"
        ]
    }

    private generate() {
        // TODO: Male, female, place
        TextGenerator.initModel(this.data.male);
        this.setState({
            output: TextGenerator.generate(10)
        });
    }

    public render() {
        const output = [];
        if (this.state.output.length > 0) {
            output.push(
                <div key='div' className='divider' />
            );
        }
        for (let n = 0; n !== this.state.output.length; ++n) {
            output.push(
                <div key={n} className='section'>
                    {this.state.output[n].toLowerCase()}
                </div>
            );
        }

        return (
            <div className='name'>
                <button onClick={() => this.generate()}>generate names</button>
                <div className='name-output'>
                    {output}
                </div>
            </div>
        );
    }
}
