import { Module } from 'feret';
import { Apollo } from './Apollo';
import { AuthStateManager } from './AuthStateManager';
import { Storage } from './Storage';

@Module({
  discovery: [],
  bootOrder: [AuthStateManager, Apollo],
})
export class ServerModule {}
