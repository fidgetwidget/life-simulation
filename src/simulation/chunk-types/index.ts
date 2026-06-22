import type { QChunk } from '../qchunk';

export enum ChunkType {
  Forest = 'forest',
  Meadow = 'meadow',
}

export const isForest = (_: QChunk): boolean => false;
export const isMeadow = (_: QChunk): boolean => false;
