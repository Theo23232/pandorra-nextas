import NodeCache from 'node-cache';

const cacheSingleton = () => {
  return new NodeCache();
};

declare global {
  var globalCache: undefined | ReturnType<typeof cacheSingleton>;
}

export const myCache = globalThis.globalCache ?? cacheSingleton();
