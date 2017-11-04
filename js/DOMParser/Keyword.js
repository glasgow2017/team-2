class Keyword {
    word = "";
    rating = "";

    constructor(word) {
        this.word = word;
    }
}

class ImgKeyword extends Keyword {
    static imageWeighting = 1;
    constructor(word, confidence) {
        super(word);
        this.rating = confidence * ImgKeyword.imageWeighting;
    }
}

class TextKeyword extends Keyword {
    static textWeighting = 1;
    constructor(word, frequency, textSize) {
        super(word);
        this.rating = (frequency/textSize) * TextKeyword.textWeighting;
    }
}