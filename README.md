# Scribacus
A tool for transcribing and getting a words-per-minute count from speech in .wav files. 

# Scribe + Abacus = Scribacus
transcribing and counting words so you don't have to!

# Usage
`python scribacus.py '/path/to/folder'`

on Windows, it looks more like:
`python scribacus.py 'drive:\path\to\folder'`

# Dependencies

Scribacus uses SpeechRecognition(which relies on CMU PocketSphinx for word recognition), and Librosa for grabbing information about audio files.
To make things a bit easier, `util/scribacus-install-dependencies.py` can sort the dependencies out for you. It only assumes that you have `pip`.
simply `cd` into `util/`
and `python scribacus-install-dependencies.py`
