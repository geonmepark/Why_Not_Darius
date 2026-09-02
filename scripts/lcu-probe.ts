import { LcuWatcher } from '../electron/lcu/watcher';
import { resolveLeagueLockfilePath } from '../electron/lcu/resolve-lockfile';

console.log('resolved lockfile:', resolveLeagueLockfilePath());

const watcher = new LcuWatcher((e) => {
  if (e.type === 'connected') {
    console.log('EVENT connected  port=', e.credentials.port, 'proto=', e.credentials.protocol);
  } else if (e.type === 'champ-select') {
    console.log(
      'EVENT champ-select phase=',
      e.session.timer?.phase,
      'theirTeam=',
      e.session.theirTeam?.length,
    );
  } else {
    console.log('EVENT', e.type, e.type === 'error' ? e.message : '');
  }
});

watcher.start();
setTimeout(() => {
  watcher.stop();
  console.log('--- probe done ---');
  process.exit(0);
}, 12_000);
