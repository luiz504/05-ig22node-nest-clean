# Prisma Commands

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

``` bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

Transform to base64

``` bash
openssl base64 -A -in public_key.pem -out public_key_base64.txt
```
