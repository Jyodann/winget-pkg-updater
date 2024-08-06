from ruamel.yaml import YAML
import pathlib

# Supported Archs:
# ['x64', 'x86', 'arm64', 'arm', 'neutral']

yaml=YAML(typ='safe') 
archs = []
for application in pathlib.Path("./manifest/manifests/").rglob("*.installer.yaml"):
    print(application)
    file = yaml.load(application)
    pass