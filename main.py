from ruamel.yaml import YAML
import pathlib
import sqlite3
import os
#can also use file command to determine architecture

# Supported Archs:
# ['x64', 'x86', 'arm64', 'arm', 'neutral']
db_name = "winget-pkg-app.db"
yaml=YAML(typ='safe') 
archs = []
application_no = 0
num_app_and_archs = 0
if (os.path.exists(db_name)):
    os.remove(db_name)

con = sqlite3.connect(db_name)
new_cur = con.cursor()

new_cur.execute('''
CREATE TABLE "Applications" (
	"Id"	INTEGER NOT NULL UNIQUE,
    "Name"	TEXT NOT NULL,
	"Identifier"	TEXT NOT NULL,
	"Version"	TEXT NOT NULL,
	"Publisher"	TEXT NOT NULL,
    "Licence"	TEXT NOT NULL,
    "ShortDescription"	TEXT NOT NULL,       
    "Architecture"	TEXT NOT NULL,  
	PRIMARY KEY("Id" AUTOINCREMENT)
)
''')

con.commit()

execute_command = []

for application_installer_path in pathlib.Path("./manifest/manifests/").rglob("*.installer.yaml"):

    # <PackageIdentifier>.installer.yaml
    installer_file = yaml.load(application_installer_path)
    
    identifier = installer_file["PackageIdentifier"]
    version =  installer_file["PackageVersion"]

    # <PackageIdentifier>.yaml
    manifest_version_path = application_installer_path.parent.joinpath(f"{identifier}.yaml")
    version_info = yaml.load(manifest_version_path)
    
    default_locale = version_info["DefaultLocale"]

    # <PackageIdentifier>.locale.<defaultLocale>.yaml
    manifest_metadata_path = application_installer_path.parent.joinpath(f"{identifier}.locale.{default_locale}.yaml")
    metadata = yaml.load(manifest_metadata_path)

    publisher = metadata["Publisher"]
    package_name = metadata["PackageName"]
    license = metadata["License"]
    short_desc = metadata["ShortDescription"]
    archs = set()
    for installers in installer_file["Installers"]:
        architecture = installers["Architecture"]
        archs.add( (package_name, identifier, version, publisher, license, short_desc, architecture) )
    
    for data in archs:
        execute_command.append(data)
        num_app_and_archs += 1

    application_no += 1

con.executemany("INSERT INTO Applications(Name, Identifier, Version, Publisher, Licence, ShortDescription, Architecture) VALUES(?, ?, ?, ?, ?, ?, ?)", execute_command)
con.commit()
print(f"Added {application_no} Packages with {num_app_and_archs} Different Installers")