import {createActionGroup, props} from '@ngrx/store';
import {Profile} from '@tt/data-access/profile';

export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'profiles loaded': props<{ profiles: Profile[] }>(),
    'filter events': props<{ filters: Record<string, any> }>(),
  }
})
