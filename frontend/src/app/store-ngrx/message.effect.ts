// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { tap, map } from 'rxjs/operators';
// import { addMessage, loadMessages } from './message.actions';

// @Injectable()
// export class MessageEffects {
//   constructor(private actions$: Actions) {}

//   persistMessages$ = createEffect(
//     () =>
//       this.actions$.pipe(
//         ofType(addMessage),
//         tap(action => {
//           const messages = JSON.parse(localStorage.getItem('messages') as string) || [];
//           messages.push(action.message);
//           localStorage.setItem('messages', JSON.stringify(messages));
//         })
//       ),
//     { dispatch: false }
//   );

//   loadMessages$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(loadMessages),
//       map(() => {
//         const messages = JSON.parse(localStorage.getItem('messages') as string) || [];
//         return loadMessages();
//       })
//     )
//   );
// }

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { addMessage, loadMessages } from './message.actions';

@Injectable()
export class MessageEffects {
  constructor(private actions$: Actions) {}
  
  persistMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addMessage),
        map(action => {
          const messages = JSON.parse(localStorage.getItem('messages') || '[]');
          messages.push(action.message);
          localStorage.setItem('messages', JSON.stringify(messages));
        })
      ),
    { dispatch: false }
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMessages),
      map(() => {
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        return { type: 'Messages Loaded', messages }; // Dispatch a new action with the loaded messages
      })
    )
  );
}
