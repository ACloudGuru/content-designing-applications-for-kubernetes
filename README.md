# The Ultimate List of Everything!

`The Ultimate List of Everything!` is a sample project for the *Designing Applications for Kubernetes* course. Create your own fork of this project and follow along as we implement the [twelve-factor application design methodology](https://12factor.net/) in Kubernetes!


- Has an os-level dependency / command line call
- Uses a language-based dependency manager
- Takes in non-sensitive configuration via file or env var (ConfigMap)
- Takes in sensitive configuration via file or env var (Secret)
- Talks to a backing service via network
- backing service url / creds are hard coded or similar
- Web app (listens on a port, can do horiz scaling etc)
- Writes something to the file system (cache or something)
- Logs to a file
- Includes an admin process of some sort
