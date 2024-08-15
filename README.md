# WOAR (Windows On ARM Ready?)

## What is this?

A simple tool that scrapes the [Winget Package Directory](https://github.com/microsoft/winget-pkgs) from Microsoft and figures out if the developer is offering an ARM/ARM64 version that can run natively on the new Windows on ARM / CoPilot+ PCs.

## How do you determine if something is ready for ARM?

In Winget, developers are able to provide an ARM/ARM64 build. This tool only scans those and provides a quick web interface to look through without having to install Winget on a Windows on ARM Machine. It makes no guarantees about the usability of provided application. You can see a sample manifest of [Microsoft Edge](https://github.com/microsoft/winget-pkgs/blob/d1db63d19a9ca0a772b7f25031fb7758bdf4814b/manifests/m/Microsoft/Edge/124.0.2478.80/Microsoft.Edge.installer.yaml#L4)

## What about Prism?

[Prism](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation#prism), is Microsoft's emulation layer to run x86 applications on the ARM platform, similar to Apple's [Rosetta 2](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment) for their M-Series chips. This tool does **not** scan applications for their performance / compatibility with Prism. As of now, any applications marked x86 only will be considered not compatible with Windows on ARM, results may vary if run on actual hardware with emulation.

## How does data get refreshed / parsed?

Every 12 hours, a Github Action is run that pulls the latest version of the [Winget Repository](https://github.com/microsoft/winget-pkgs). A Python script (main.py) is run that scans all of the `.installer.yaml` files, dumps them into a SQLite file. This SQLite file is read by [Lume](https://lume.land/), a Deno based SSG, which generates all the info you see on the site.

## Is there an API I can use to access this info?

You can feel free to download the SQLite file that creates the site. The file is automatically updated every 12 hours or so, and is uploaded as an artifact under all the workflow runs [here](https://github.com/Jyodann/woar/actions/workflows/publish_site_daily.yml). Click on the latest run by the "Update Site every 12 hours" action, and scroll down to find the `winget-pkg-db.db` file. From there, you can feel free to use the Database however you choose.
