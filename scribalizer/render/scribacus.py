#!/usr/bin/env python
import psycopg2 as psql
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
    file_path = sys.argv[1]
    recon = asr.Recognizer()
    print("Success.")
    _analyze(file_path, recon)


def _analyze(file_path, recon):
    """Iterate through folder of .wav files"""
    norm_path = path.normpath(file_path)
    if norm_path.endswith(".wav") and _check_duplicates(norm_path) is False:
        with asr.AudioFile(norm_path) as source:
            audio = recon.record(source)
            try:
                print("Analyzing...")
                duration = rosa.get_duration(filename=norm_path)
                templist = recon.recognize_sphinx(audio)
                templist = templist.split()
                templist = " ".join(templist)
                wordcount = len(templist)
                print("Word Count:", wordcount)
                print("Duration:", duration, "seconds.")
                print("Words Per Minute:",
                      _WPM_calculate(wordcount, duration))
                print(templist)
                print("------------------------")
                _store_data(norm_path, templist)
            except asr.UnknownValueError:
                print("unintelligible audio")

            except asr.RequestError as e:
                print("sphinx error; {0}".format(e))


def _WPM_calculate(wordcount, duration):
    """Calculate words per minute given a word count and duration."""
    if duration <= 60.0:
        frac_dur = duration/60.0
        WPM = wordcount/frac_dur
        return WPM
    elif duration > 60.0:
        frac_dur = 60.0/duration
        WPM = frac_dur*wordcount
        return WPM

def _check_duplicates(path):
    connection = psql.connect("dbname=asrdb user=postgres")
    cursor = connection.cursor()
    cursor.execute("SELECT file_path FROM asr_data WHERE file_path = %s", (path,))
    desc = cursor.rowcount
    if desc == 0:
        cursor.close()
        connection.close()
        return False
    else:
        cursor.close()
        connection.close()
        print("Element already in DataBase.")
        return True

def _store_data(file_path, text_data):
    connection = psql.connect("dbname=asrdb user=postgres")
    cursor = connection.cursor()
    cursor.execute("INSERT INTO asr_data (file_path, raw_data) VALUES (%s, %s)",
        (file_path, text_data))
    connection.commit()
    cursor.close()
    connection.close()


main()
