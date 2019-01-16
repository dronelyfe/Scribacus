import subprocess
import sys

subprocess.call([sys.executable, '-m', 'pip', 'install', 'pocketsphinx'])
subprocess.call([sys.executable, '-m', 'pip', 'install', 'SpeechRecognition'])
subprocess.call([sys.executable, '-m', 'pip', 'install', 'librosa'])
