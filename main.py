
import os

for subdir, dirs, files in os.walk("./manifest/manifests"):
    for file in files:
        print(os.path.join(subdir, file))