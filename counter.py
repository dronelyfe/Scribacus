#!/usr/bin/env python

import speech_recognition as asr
import librosa.core as rosa
import subprocess
import sys
import os
from os import path
from pocketsphinx import AudioFile


def main():
    """Take a folder path as a parameter, scan all files in it."""
    print("Starting...")
    folder_path = sys.argv[1]
    AUDIO_FOLDER = os.listdir(folder_path)
    recon = asr.Recognizer()
    print("Success.")
    _iterate(AUDIO_FOLDER, folder_path, recon)


def _iterate(folder, folder_path, recon):
    """Iterate through folder of .wav files"""
    print("Iterating...")
    for file in folder:
        if file.endswith(".wav"):
            full_path = path.join(folder_path, file)
            with asr.AudioFile(full_path) as source:
                audio = recon.record(source)
                try:
                    print("Analyzing", file)
                    duration = rosa.get_duration(filename=full_path)
                    templist = recon.recognize_sphinx(audio)
                    templist = templist.split()
                    wordcount = len(templist)
                    print("Word Count:", wordcount)
                    print("Duration:", duration, "seconds.")
                    print("Words Per Minute:",
                          _WPM_calculate(wordcount, duration))
                    print(templist)
                    print("------------------------")
                except asr.UnknownValueError:
                    print("unintelligible audio")

                except asr.RequestError as e:
                    print("sphinx error; {0}".format(e))
    print("Completed.")


def _WPM_calculate(wordcount, duration):

    if duration < 60.0:
        frac_dur = duration/60.0
        WPM = wordcount/frac_dur
        return WPM
    elif duration > 60.0:
        frac_dur = 60.0/duration
        WPM = frac_dur*wordcount
        return WPM


main()
