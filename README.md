# RBAC-System_Security

Design and implementation of a secure distributed system where users authenticate through a central authorization server. The system enforces Role-Based Access Control (RBAC) to restrict access to service operations, using JWT tokens for authorization and TLS certificates for secure communication between services.

## Installation

### Prerequisites

* [`Docker`](https://www.docker.com)
* [`Docker Compose`](https://www.docker.com)

### Installing Docker

The best approach to install `Docker` is to follow the official guide [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-repository).

Please follow the steps in the **Install using the repository** section.

Next, follow [these](https://docs.docker.com/install/linux/linux-postinstall/) steps to configure Docker access with non-sudo permissions in the **Manage Docker as a non-root user** section.

### Installing Docker Compose

The best approach to install `Docker Compose` is to follow the official guide [here](https://docs.docker.com/compose/install/#install-compose).

## Usage

To start developing, you must build and start the servers:

```bash
docker compose up --build
```

Then you can populate the Database:

```bash
./populate
```

You will need to add the ca.pem Certificate to your Browser. If you are using firefox you can use the following example:

```text
Open Firefox.
Go to Preferences/Settings:
Click the menu button (☰) in the top-right.
Select Settings (or Preferences on Linux/Mac).
Search for Certificates:
In the Settings search bar, type certificates.
Click on View Certificates… (under "Privacy & Security" > "Certificates").
Import Your CA:
In the Certificate Manager, go to the Authorities tab.
Click Import….
Select the ca.pem file in the shared/certs folder.
When prompted, check Trust this CA to identify websites.
Click OK.
Restart Firefox (close all windows and reopen).
```

## Project Structure

```
├── clien-app :: React app.
├── auth-server :: NodeJs server for authentication.
├── service1 :: NodeJs server for proof of concept.
├── service2 :: NodeJs server for proof of concept.
└── shared :: Common files across all servers.
```


