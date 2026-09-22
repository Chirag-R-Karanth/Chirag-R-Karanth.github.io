// data.js — site content that is easier to maintain as data.
// Photos: add real files under assets/photos/ and set src to the .jpg.
// If a .jpg contains EXIF GPS, its position is read automatically and overrides lat/lng.

(function () {
  var PLACES = {
    bengaluru: { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    mysuru:    { name: 'Mysuru',    lat: 12.2958, lng: 76.6394 },
    coorg:     { name: 'Coorg',     lat: 12.4244, lng: 75.7382 },
    mumbai:    { name: 'Mumbai',    lat: 19.0760, lng: 72.8777 },
    goa:       { name: 'Goa',       lat: 15.2993, lng: 74.1240 }
  };

  var PHOTOS = [
    { id: 'blr-01', place: 'bengaluru', title: 'MG Road, after rain',  date: '2025-08', cam: 'Fuji X-T30', lens: 'XF 35mm f/2',     ex: 'f/2 · 1/125 · ISO 400', tags: ['street'], src: 'assets/photos/bengaluru-01.svg', lat: 12.9752, lng: 77.6035 },
    { id: 'blr-02', place: 'bengaluru', title: 'The autorickshaw wall', date: '2025-09', cam: 'Fuji X-T30', lens: 'XF 35mm f/2',    ex: 'f/2.8 · 1/250 · ISO 200', tags: ['street'], src: 'assets/photos/bengaluru-02.svg', lat: 12.9716, lng: 77.5946 },
    { id: 'blr-03', place: 'bengaluru', title: 'Metro platform, off-peak', date: '2025-07', cam: 'OnePlus 13', lens: '23mm',       ex: '1/480 · ISO 120', tags: ['urban'], src: 'assets/photos/bengaluru-03.svg', lat: 12.9763, lng: 77.5907 },
    { id: 'blr-04', place: 'bengaluru', title: 'Cubbon Park, late afternoon', date: '2025-03', cam: 'Fuji X-T30', lens: 'XF 18-55mm', ex: 'f/5.6 · 1/500 · ISO 320', tags: ['nature', 'city'], src: 'assets/photos/bengaluru-04.svg', lat: 12.9756, lng: 77.5916 },
    { id: 'blr-05', place: 'bengaluru', title: 'Chinnaswamy, through the fence', date: '2025-01', cam: 'OnePlus 13', lens: '23mm', ex: '1/1000 · ISO 140', tags: ['urban'], src: 'assets/photos/bengaluru-05.svg', lat: 12.9788, lng: 77.5991 },

    { id: 'mys-01',  place: 'mysuru', title: 'Palace lights on', date: '2024-12', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/4 · 1/60 · ISO 800', tags: ['architectural'], src: 'assets/photos/mysuru-01.svg', lat: 12.3052, lng: 76.6554 },
    { id: 'mys-02',  place: 'mysuru', title: 'The old market lane', date: '2024-12', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/3.5 · 1/125 · ISO 400', tags: ['street'], src: 'assets/photos/mysuru-02.svg', lat: 12.3081, lng: 76.6475 },
    { id: 'mys-03',  place: 'mysuru', title: 'Devaraja market, morning', date: '2024-12', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/4 · 1/80 · ISO 320', tags: ['street'], src: 'assets/photos/mysuru-03.svg', lat: 12.3092, lng: 76.6480 },
    { id: 'mys-04',  place: 'mysuru', title: 'Chamundi hill, top table', date: '2024-12', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/8 · 1/320 · ISO 100', tags: ['landscape'], src: 'assets/photos/mysuru-04.svg', lat: 12.2735, lng: 76.6729 },
    { id: 'mys-05',  place: 'mysuru', title: 'A quiet street, kolu end', date: '2025-04', cam: 'OnePlus 13', lens: '23mm', ex: '1/250 · ISO 160', tags: ['street'], src: 'assets/photos/mysuru-05.svg', lat: 12.2960, lng: 76.6420 },

    { id: 'coorg-01', place: 'coorg', title: 'Misty flats, Virajpet road', date: '2025-02', cam: 'OnePlus 13', lens: '23mm', ex: '1/500 · ISO 100', tags: ['nature'], src: 'assets/photos/coorg-01.svg', lat: 12.1900, lng: 75.8020 },
    { id: 'coorg-02', place: 'coorg', title: 'Coffea, early', date: '2025-02', cam: 'OnePlus 13', lens: '23mm', ex: '1/640 · ISO 120', tags: ['nature'], src: 'assets/photos/coorg-02.svg', lat: 12.4244, lng: 75.7382 },
    { id: 'coorg-03', place: 'coorg', title: 'The long walk down', date: '2025-02', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/6.3 · 1/400 · ISO 200', tags: ['landscape'], src: 'assets/photos/coorg-03.svg', lat: 12.4200, lng: 75.7300 },
    { id: 'coorg-04', place: 'coorg', title: 'Aboo falls, far view', date: '2025-06', cam: 'OnePlus 13', lens: '23mm', ex: '1/800 · ISO 100', tags: ['nature'], src: 'assets/photos/coorg-04.svg', lat: 12.5830, lng: 75.7570 },
    { id: 'coorg-05', place: 'coorg', title: 'Estate fog, 7 AM', date: '2025-02', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/5.6 · 1/250 · ISO 400', tags: ['nature'], src: 'assets/photos/coorg-05.svg', lat: 12.4700, lng: 75.7800 },

    { id: 'bom-01', place: 'mumbai', title: 'Marine Drive, blue hour', date: '2024-10', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/5 · 2s · ISO 100', tags: ['urban', 'city'], src: 'assets/photos/mumbai-01.svg', lat: 18.9435, lng: 72.8244 },
    { id: 'bom-02', place: 'mumbai', title: 'Local, skipping the stop', date: '2024-10', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/4 · 1/500 · ISO 200', tags: ['street'], src: 'assets/photos/mumbai-02.svg', lat: 18.9689, lng: 72.8185 },
    { id: 'bom-03', place: 'mumbai', title: 'Gateway, from the water', date: '2024-10', cam: 'OnePlus 13', lens: '23mm', ex: '1/1000 · ISO 110', tags: ['city'], src: 'assets/photos/mumbai-03.svg', lat: 18.9219, lng: 72.8346 },
    { id: 'bom-04', place: 'mumbai', title: 'Bandra, far shoreline', date: '2024-10', cam: 'Sony A6000', lens: '16-50mm', ex: 'f/8 · 1/320 · ISO 100', tags: ['urban'], src: 'assets/photos/mumbai-04.svg', lat: 19.0555, lng: 72.8250 },
    { id: 'bom-05', place: 'mumbai', title: 'Monsoon high tide', date: '2025-07', cam: 'OnePlus 13', lens: '23mm', ex: '1/2000 · ISO 140', tags: ['nature', 'city'], src: 'assets/photos/mumbai-05.svg', lat: 18.9500, lng: 72.8200 },

    { id: 'goa-01', place: 'goa', title: 'Fontainhas, old arms', date: '2024-11', cam: 'Fuji X-T30', lens: 'XF 35mm f/2', ex: 'f/2 · 1/200 · ISO 320', tags: ['street'], src: 'assets/photos/goa-01.svg', lat: 15.5010, lng: 73.9130 },
    { id: 'goa-02', place: 'goa', title: 'Candolim, empty north end', date: '2024-11', cam: 'Fuji X-T30', lens: 'XF 18-55mm', ex: 'f/8 · 1/1000 · ISO 100', tags: ['landscape', 'nature'], src: 'assets/photos/goa-02.svg', lat: 15.5190, lng: 73.7620 },
    { id: 'goa-03', place: 'goa', title: 'Chapora, end of light', date: '2024-11', cam: 'Fuji X-T30', lens: 'XF 35mm f/2', ex: 'f/2.8 · 1/60 · ISO 400', tags: ['landscape'], src: 'assets/photos/goa-03.svg', lat: 15.6080, lng: 73.7380 },
    { id: 'goa-04', place: 'goa', title: 'Anjuna market, wire fish', date: '2024-11', cam: 'Fuji X-T30', lens: 'XF 35mm f/2', ex: 'f/4 · 1/320 · ISO 200', tags: ['street'], src: 'assets/photos/goa-04.svg', lat: 15.5823, lng: 73.7430 },
    { id: 'goa-05', place: 'goa', title: 'Boat, waiting for hire', date: '2024-11', cam: 'OnePlus 13', lens: '23mm', ex: '1/640 · ISO 120', tags: ['nature'], src: 'assets/photos/goa-05.svg', lat: 15.5810, lng: 73.7400 },

    { id: 'vid-01', place: 'bengaluru', title: 'Short — monsoon on the street', date: '2025-08', cam: 'OnePlus 13', ex: '40s · handheld', tags: ['video'], type: 'video', src: '', lat: 12.9720, lng: 77.5940 },
    { id: 'vid-02', place: 'coorg', title: 'Short — coffee pour, up close', date: '2025-02', cam: 'OnePlus 13', ex: '12s · close focus', tags: ['video'], type: 'video', src: '', lat: 12.4250, lng: 75.7420 },
    { id: 'vid-03', place: 'goa', title: 'Short — 12 fps, handheld', date: '2024-11', cam: 'Fuji X-T30', ex: '15s · 24fps', tags: ['video'], type: 'video', src: '', lat: 15.5850, lng: 73.7400 }
  ];

  // Some placeholders use a poster svg for video tiles (no clip yet).
  // Uncomment/point src at a real .mp4 when you have clips:
  PHOTOS.forEach(function (p) {
    if (p.type === 'video' && !p.poster) { p.poster = 'assets/photos/' + p.place + '-05.svg'; }
  });

  var TYPES = { book: 'Reading', game: 'Gaming', anime: 'Anime', film: 'Movies', series: 'TV' };

  var MEDIA = [
    { title: 'The Design of Everyday Things', creator: 'Don Norman', type: 'book',  state: 'done', fav: true,  note: 'Read it and started redesigning exam halls in my head.' },
    { title: 'Atomic Habits', creator: 'James Clear', type: 'book', state: 'done', fav: false, note: 'The 1%-better thing actually holds up. Annoying.' },
    { title: 'Eloquent JavaScript', creator: 'Marijn Haverbeke', type: 'book', state: 'in', fav: true, note: 'Re-reading the sections I skipped the first time. Rude.' },
    { title: 'The Pragmatic Programmer', creator: 'Hunt & Thomas', type: 'book', state: 'backlog', fav: false, note: 'Started, paused, feeling watched by every bookmark.' },
    { title: 'Project Hail Mary', creator: 'Andy Weir', type: 'book', state: 'wish', fav: false, note: 'Fusion jazz and science. Soon.' },

    { title: 'Elden Ring', creator: 'FromSoft', type: 'game', state: 'done', fav: true, note: 'The one where I stopped playing and started studying.' },
    { title: 'Portal 2', creator: 'Valve', type: 'game', state: 'done', fav: true, note: 'GLaDOS is the best boss I keep coming back to.' },
    { title: 'Hollow Knight', creator: 'Team Cherry', type: 'game', state: 'in', fav: false, note: 'Currently lost somewhere in Greenpath with all doors open.' },
    { title: 'Celeste', creator: 'Matt Makes Games', type: 'game', state: 'done', fav: false, note: 'Fell twice, climbed back up, cried a little.' },
    { title: 'Balatro', creator: 'LocalThunk', type: 'game', state: 'in', fav: false, note: 'Do not open before dinner. You will be late.' },

    { title: 'Steins;Gate', creator: '5pb', type: 'anime', state: 'done', fav: true, note: 'Rewatched every two years. Never gets old.' },
    { title: 'Vinland Saga', creator: 'Makoto Yukimura', type: 'anime', state: 'in', fav: false, note: 'Rewiring my definition of strength, one episode at a time.' },
    { title: 'Frieren', creator: 'Kanehito Yamada', type: 'anime', state: 'done', fav: false, note: 'The quietest thing that ever broke me.' },
    { title: 'Attack on Titan', creator: 'Wit/ Mappa', type: 'anime', state: 'done', fav: true, note: 'The ending discourse still lives in my mentions.' },

    { title: 'Blade Runner 2049', creator: 'Denis Villeneuve', type: 'film', state: 'done', fav: true, note: 'Every frame is a desktop wallpaper I keep meaning to use.' },
    { title: 'Spirited Away', creator: 'Hayao Miyazaki', type: 'film', state: 'done', fav: true, note: 'Bathhouse rules. First love too.' },
    { title: 'Prestige', creator: 'Nolan', type: 'film', state: 'done', fav: false, note: 'Stayed up an hour thinking about the bird box.' },
    { title: 'Dune: Part Two', creator: 'Villeneuve', type: 'film', state: 'backlog', fav: false, note: 'Waiting for the right screen and a full day off.' },

    { title: 'Breaking Bad', creator: 'Vince Gilligan', type: 'series', state: 'done', fav: true, note: 'The upgrade-worthy villain arc nobody recovers from.' },
    { title: 'Scavengers Reign', creator: 'Green & Huettner', type: 'series', state: 'done', fav: true, note: 'The most alien ecology on TV. Gorgeous horror.' },
    { title: 'Severance', creator: 'Ben Stiller', type: 'series', state: 'in', fav: false, note: 'Trying to figure out the office like a detective.' },
    { title: 'Mad Men', creator: 'Matthew Weiner', type: 'series', state: 'backlog', fav: false, note: 'For when I want to feel underdressed at 10 AM.' }
  ];

  window.SITE_DATA = {
    places: PLACES,
    photos: PHOTOS,
    media: MEDIA,
    mediaTypes: TYPES
  };
})();