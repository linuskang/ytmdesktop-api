# ytmdesktop-api

Simple wrapper API for YTM-Desktop to fetch current song info.

## Get Started

```bash
git clone https://github.com/linuskang/ytmdesktop-api
cd ytmdesktop-api

cp .env.example .env # edit to your values

npm i
npm run dev
```

Access at ``http://localhost:8080`` for route definitions. View your current song at ``/listening``.

## Notes

To avoid ratelimits, ``ytmdesktop-api`` caches the current song and stores it for 10 seconds before fetching from origin. To adjust this, edit ``CACHE_DURATION`` in ``src/app.js``

## License

See [LICENSE](LICENSE) for details.