#!/usr/bin/env python

import speech_recognition as asr
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
            with asr.AudioFile(path.join(folder_path, file)) as source:
                audio = recon.record(source)
                try:
                    print("Analyzing", file)
                    templist = recon.recognize_sphinx(audio)
                    templist = templist.split()
                    print("Word Count:", len(templist))

                    print(templist)
                    print("------------------------")
                except sr.UnknownValueError:
                    print("unintelligible audio")

                except asr.RequestError as e:
                    print("sphinx error; {0}".format(e))
    print("Completed.")

def _get_duration(filepath):
    args = ("ffprobe", "-hide_banner",
            "-print_format flat", "-show_entries",
            "format=duration", "-i", filepath)
    try:
        result = subprocess.Popen(args,
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        output = result.communicate()
        print(output[0])
    except subprocess.CalledProcessError:
        pass

main()
