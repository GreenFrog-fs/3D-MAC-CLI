import { create } from "zustand";

const useTileStore = create((set, get) => ({
  tiles: [],
  userTile: [null, null],
  setUserTile: (tile) => {
    const [newTileX, newTileY] = tile;
    set((state) => {
      const newTiles = state.tiles.some(
        (t) => t[0] === newTileX && t[1] === newTileY
      )
        ? state.tiles
        : [...state.tiles, tile];
      const limitedTiles = newTiles.length > 10 ? newTiles.slice(-5) : newTiles;
      return {
        userTile: tile,
        tiles: limitedTiles,
      };
    });
  },
  addTile(offsetx, offsety) {
    const userTile = get().userTile;
    const tile = [userTile[0] + offsetx, userTile[1] + offsety];
    const [newTileX, newTileY] = tile;
    set((state) => ({
      tiles: state.tiles.some((t) => t[0] === newTileX && t[1] === newTileY)
        ? state.tiles
        : [...state.tiles, tile],
    }));
  },
}));

export default useTileStore;
