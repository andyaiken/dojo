// This utility file deals with speech

export default class Ustinov {
    public static async say(text: string, languages: string[]) {
        // If we're  already saying something, stop it
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = await Ustinov.chooseVoice(languages);
        utterance.rate = Ustinov.randomValue(0.5, 1.5);
        utterance.pitch = Ustinov.randomValue(0.5, 1.5);

        window.speechSynthesis.speak(utterance);
    }

    private static async chooseVoice(languages: string[]) {
        const voices = await Ustinov.getVoices();

        // Get language codes for the selected languages
        const langCodes = languages.map(lang => Ustinov.getLanguageCode(lang));

        // Filter voice list by these language codes
        let candidates = voices.filter(v => langCodes.includes(v.lang.substr(0, 2)));
        if (candidates.length === 0) {
            candidates = voices.filter(v => v.default);
        }
        if (candidates.length === 0) {
            candidates = voices;
        }

        const index = Math.floor(Math.random() * candidates.length);
        return candidates[index];
    }

    private static getVoices() {
        return new Promise<SpeechSynthesisVoice[]>(resolve => {
            let list = window.speechSynthesis.getVoices();
            if (list.length > 0) {
                resolve(list);
                return;
            }
            speechSynthesis.onvoiceschanged = () => {
                list = window.speechSynthesis.getVoices();
                resolve(list);
            };
        });
    }

    private static getLanguageCode(language: string) {
        switch (language) {
            case 'armenian':
                return 'hy';
            case 'basque':
                return 'eu';
            case 'bulgarian':
                return 'bg';
            case 'chichewa':
                return 'ny';
            case 'chinese':
                return 'zh';
            case 'croatian':
                return 'hr';
            case 'czech':
                return 'cs';
            case 'dutch':
                return 'nl';
            case 'german':
                return 'de';
            case 'greek':
                return 'el';
            case 'icelandic':
                return 'is';
            case 'irish':
                return 'ga';
            case 'kannada':
                return 'kn';
            case 'kazakh':
                return 'kk';
            case 'latvian':
                return 'lv';
            case 'lithuanian':
                return 'lt';
            case 'macedonian':
                return 'mk';
            case 'malay':
                return 'ms';
            case 'maltese':
                return 'mt';
            case 'maori':
                return 'mi';
            case 'polish':
                return 'pl';
            case 'portuguese':
                return 'pt';
            case 'punjabi':
                return 'pa';
            case 'samoan':
                return 'sm';
            case 'serbian':
                return 'sr';
            case 'shona':
                return 'sn';
            case 'spanish':
                return 'es';
            case 'swedish':
                return 'sv';
            case 'turkish':
                return 'tr';
            case 'welsh':
                return 'cy';
            default:
                return language.substr(0, 2);
        }
    }

    private static randomValue(min: number, max: number) {
        const x = (Math.random() + Math.random() + Math.random()) / 3;
        const range = max - min;
        return min + (x * range);
    }
}
