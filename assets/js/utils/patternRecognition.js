
// patternRecognition.js: A pattern recognition and predictive listening script for audio-based visualizers

class PatternRecognizer {
    constructor(analyser, bufferSize = 30) { // Reduced buffer size for performance
        this.analyser = analyser;
        this.bufferSize = bufferSize;
        this.patternBuffer = [];
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    updatePatternBuffer() {
        // Get current frequency data and add to pattern buffer
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.patternBuffer.push([...this.frequencyData]);

        // Limit buffer size
        if (this.patternBuffer.length > this.bufferSize) {
            this.patternBuffer.shift();
        }
    }

    detectPattern() {
        // Compare the current pattern to past patterns in the buffer
        if (this.patternBuffer.length < this.bufferSize) return null;

        const lastPattern = this.patternBuffer[this.bufferSize - 1];
        const secondLastPattern = this.patternBuffer[this.bufferSize - 2];

        // Check if the last two patterns are similar
        if (this.comparePatterns(lastPattern, secondLastPattern)) {
            return lastPattern;
        }

        return null;
    }

    comparePatterns(pattern1, pattern2, tolerance = 0.85) { // Lower tolerance for better performance
        // Calculate similarity score between two patterns
        let matchCount = 0;
        for (let i = 0; i < pattern1.length; i++) {
            if (Math.abs(pattern1[i] - pattern2[i]) < (255 * (1 - tolerance))) {
                matchCount++;
            }
        }
        return matchCount / pattern1.length >= tolerance;
    }
}

export default PatternRecognizer;
