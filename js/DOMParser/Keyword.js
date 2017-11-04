class Keyword {
    constructor(word) {
        this.word = word;
        this.rating = -1;
        this.imageWeighting = 1;
        this.textWeighting = 1;
    }

    static compareTo(k1, k2) {
        if (!(k1 instanceof Keyword)) {
            throw "Illegal argument"
        }
        if (!(k2 instanceof Keyword)) {
            throw "Illegal argument"
        }
        return k1.rating - k2.rating;
    }
}

class ImgKeyword extends Keyword {
    constructor(word, confidence) {
        super(word);
        this.rating = confidence * this.imageWeighting;
    }
}

class TextKeyword extends Keyword {
    constructor(word, frequency, textSize) {
        super(word);
        this.rating = (frequency/textSize) * this.textWeighting;
    }
}