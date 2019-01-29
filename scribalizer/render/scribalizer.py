#!/usr/bin/env python

import json
import sys

import psycopg2 as psql
import spacy


def main():
    file_path = sys.argv[1]
    _analyze(file_path)


def _analyze(path):
    connection = psql.connect("dbname=asrdb user=postgres")
    cursor = connection.cursor()
    cursor.execute("SELECT raw_data FROM asr_data WHERE file_path = %s", (path,))
    nlp_data = cursor.fetchall()
    nlp = spacy.load('en_core_web_sm')
    doc = nlp(nlp_data[0][0]) 
    cursor.close()
    connection.close() 
    _structure_data(doc, path)


def _structure_data(doc, path):

    features = {}
    features.setdefault(0, {"text", "dep", "pos"})
   
    for i, item in enumerate(doc):
        features[i] = {"text": item.lemma_, 
                        "dep": item.dep_,
                        "pos": item.pos_}
    # using stdout to pipe straight json string to the app.
    feature_output = json.dumps(features, indent=4, sort_keys=True)
    print(feature_output)

    # store nlp data in DB for depterity, can't be grabbed by node-deptgres :(
    # connection = psql.connect("dbname=asrdb user=deptgres")
    # cursor = connection.cursor()
    # cursor.execute("INSERT INTO asr_data (file_path, nlp_data) VALUES (%s, %s)", 
    #                 (path, feature_output))
    # connection.commit()
    # cursor.close()
    # connection.close() 


main()
