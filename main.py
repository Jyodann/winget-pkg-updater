from ruamel.yaml import YAML
import pathlib
import sqlite3
import os
#can also use file command to determine architecture

# Supported Archs:
# ['x64', 'x86', 'arm64', 'arm', 'neutral']

yaml=YAML(typ='safe') 
archs = []
i = 0

if (os.path.exists("test.db")):
    os.remove("test.db")

con = sqlite3.connect('test.db')
new_cur = con.cursor()

new_cur.execute('''
CREATE TABLE "Applications" (
	"Id"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"Version"	TEXT NOT NULL,
	"Achitecture"	TEXT NOT NULL,
	PRIMARY KEY("Id" AUTOINCREMENT)
)
''')

con.commit()

execute_command = []
for application in pathlib.Path("./manifest/manifests/").rglob("*.installer.yaml"):
    file = yaml.load(application)
    indentifier = file["PackageIdentifier"]
    version =  file["PackageVersion"]
    archs = set()
    for installers in file["Installers"]:
        archs.add( (indentifier, version, installers["Architecture"]) )
    
    for data in archs:
        execute_command.append(data)
        i += 1
con.executemany("INSERT INTO Applications(Name, Version, Achitecture) VALUES(?, ?, ?)", execute_command)
con.commit()
print(i)