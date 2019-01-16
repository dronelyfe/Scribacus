# Scribacus
A tool for transcribing and getting a words-per-minute count from speech in .wav files. 

# Scribe + Abacus = Scribacus
transcribing and counting words so you don't have to!

# Usage
`python counter.py '/path/to/folder'`

on Windows, it looks more like:
`python counter.py 'drive:\path\to\folder'`

# Dependencies

Scribacus uses SpeechRecognition(which relies on CMU PocketSphinx for word recognition), and Librosa for grabbing information about audio files.
