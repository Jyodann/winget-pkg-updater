from ruamel.yaml import YAML
import pathlib

#can also use file command to determine architecture

# Supported Archs:
# ['x64', 'x86', 'arm64', 'arm', 'neutral']

yaml=YAML(typ='safe') 
archs = []
i = 0
for application in pathlib.Path("./manifest/manifests").rglob("*.installer.yaml"):
    file = yaml.load(application)
    print(file["PackageIdentifier"], file["PackageVersion"])
    print(set([arch["Architecture"] for arch in file["Installers"]]))
    i += 1
    pass
print(i)