from multiprocessing import Pool
from ruamel.yaml import YAML
import pathlib
import sqlite3
import os
import time
import subprocess

#can also use file command to determine architecture

# Supported Archs:
# ['x64', 'x86', 'arm64', 'arm', 'neutral']
def main():
    db_name = "winget-pkg-app.db"
    
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
         "CreationDate" INTEGET NOT NULL,
    	PRIMARY KEY("Id" AUTOINCREMENT)
    )
    ''')

    con.commit()

    app_paths = list(pathlib.Path("./winget-pkgs/manifests/").glob("*/"))

    with Pool(len(app_paths)) as p:
        executed = p.map(get_app_data, app_paths)
    
    number_of_apps = 0
    number_of_installers = 0
    for (commands, no_apps, no_arch_apps) in executed:
        number_of_apps += no_apps
        number_of_installers += no_arch_apps
        con.executemany("INSERT INTO Applications(Name, Identifier, Version, Publisher, Licence, ShortDescription, Architecture, CreationDate) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", commands)
    con.commit()
    print(f"Added {number_of_apps} Packages with {number_of_installers} Different Installers")
    con.close()
   


def get_app_data(path):
    print(f"Processing {path}")
    app_no = 0
    arch_app_no = 0
    yaml=YAML(typ='safe') 
    execute_command = []
    for application_installer_path in path.rglob("*.installer.yaml"):
        app_no += 1
        # <PackageIdentifier>.installer.yaml
        installer_file = yaml.load(application_installer_path)
       
        abs_path = str(application_installer_path.resolve())
        #print(abs_path)
        p = subprocess.run(["git", "log", "--follow", "--format=%ad", "--date=unix", "-1", abs_path], capture_output=True, text=True, cwd="./winget-pkgs/")
        time_creation = int(p.stdout.strip())
        
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
            archs.add( (package_name, identifier, version, publisher, license, short_desc, architecture, time_creation))
        
        for data in archs:
            execute_command.append(data)
            arch_app_no += 1
    return (execute_command, app_no, arch_app_no)
if __name__ == "__main__":
	main()
