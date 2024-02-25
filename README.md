# Ignite Forum

Welcome to Ignite Forum! This is a forum API designed to enhance my backend
skills and practice various design patterns, concepts, and implementations such
as DDD, SOLID, and Clean Code. It is built using the NestJS framework, powered
by NodeJS and TypeScript, and utilizes PostgreSQL for data persistence.

## Requirements and instructions

To get started, follow these steps:

1. Set up Docker:

Make sure you have Docker Engine or Docker Desktop installed.
Run the following command to configure the Database Containers:

    ```bash
        docker compose up -D
    ```

2. Install Dependencies:

   ```bash
       npm install
   ```

3. Run Prisma Migrations:

Depending on your environment (Dev, Prod, or Test), run the appropriate Prisma migration command:

- Dev:

  ```bash
      npx prisma migrate dev
  ```

- Prod/Test:

  ```bash
      npx prisma migrate deploy
  ```

4. Set up Environment Variables:

Create a `.env` file based on `.env.example` Generate necessary keys using the
instructions provided in the `RSA256 Secrets Generation Commands` section below.

5. Firing up the Server:
   Start the server based on your environment:

- Dev:

  ```bash
      npm run start:dev
  ```

- Prod:

  ```bash
      npm run build
      npm run start:prod
  ```

## Prisma Commands

Here are some useful Prisma commands for managing your database:

    ```bash
        npx prisma init
    ```

    ```bash
        npx prisma migrate dev
    ```

    ```bash
        npx prisma studio
    ```

## RSA256 secrets Generation Commands

To generate RSA256 keys for encryption, follow these commands:

- Private
  Generate RSA

      ``` bash
          openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
      ```

Transform to base64

    ```bash
        openssl base64 -A -in private_key.pem -out private_key_base64.txt
    ```

- Public
  Generate RSA

  ```bash
      openssl rsa -pubout -in private_key.pem -out public_key.pem
  ```

Transform to base64

    ``` bash
        openssl base64 -A -in public_key.pem -out public_key_base64.txt
    ```
