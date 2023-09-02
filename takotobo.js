class jpcn_TAKOBOTO {
    constructor(options) {
        this.options = options;
        this.maxexample = 5;
        this.word = '';
    }

    setOptions(options) {
        this.options = options;
        this.maxexample = options.maxexample;
    }

    displayName() {
        return 'TAKOBOTO'
    }

    async findTerm(word) {
        this.word = word;
        let notes = await this.getTerms();

        return notes.filter(x => x).slice(0, this.maxexample + 1)
    }

    async getTerms() {
        let notes = [];
        if (!this.word) return notes;

        let base = 'https://takoboto.jp/?q=';
        let url = base + encodeURIComponent(this.word);
        let doc = '';
        try {
            let data = await api.fetch(url);
            let parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
        }
        catch(err) {
            return null;
        }

        let entries = doc.querySelectorAll('#SearchResultContent .ResultDiv') || [];
        for (let entry of entries) {
            let lines = Array.prototype.slice.call(entry.querySelectorAll('div'))
            let expression = this.T(lines[0]);
            let definitions = lines.map(divEle => divEle.innerHTML).slice(1, lines.length - 1).filter(ele => ele)
            let definition = definitions.reduce((pre, curt) => {
                return pre + '<br>' + curt;
            })
            definition = '<div>' + definition + '</div>'
            notes.push({
                expression,
                definitions: [definition]
            })
        }

        return notes;
    }


    T(node) {
        if (!node) 
            return ''
        else 
            return node.innerText.trim();
    }
}
