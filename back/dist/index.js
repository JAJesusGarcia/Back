'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
const song1 = {
  title: 'By the way',
  artist: 'Red Hot Chili Pappers',
  duration: 100,
};
const podcast1 = {
  title: 'Cuentos desde la cripta',
  host: 'Una calavera',
  episodes: 100,
};
const audiobook1 = {
  title: 'El principito',
  author: 'Antoine de no se que',
  duration: 100,
};
const myPlaylist = {
  name: 'My Playlist',
  playlist: [song1, podcast1, audiobook1],
};
console.log(myPlaylist);
