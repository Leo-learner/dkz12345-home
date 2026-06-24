# dkz12345 Home

Static main portal site for `dkz12345.com`.

## Preview

Serve locally from this directory:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/
```

## Deployment

This is a static site. The production web root is:

```text
/var/www/dkz12345.com
```

Deploy only the public site files, not `.git` or local temporary files.
