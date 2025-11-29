import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {Profile, ProfileService} from '@tt/data-access/profile';
import {computed, inject} from '@angular/core';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';

export interface ProfileState {
  profiles: Profile[];
  profilesFilter: Record<string, any>
}

const initialState: ProfileState = {
  profiles: [],
  profilesFilter: {}
}

export const profileStore = signalStore(
  withState(initialState),
  withComputed(({profiles})=>{
    return {
      profiles2: computed(()=> profiles().map(profile => ({...profile, lastName: 'BBB_BBB  '})))
    }
  }),
  withMethods((state, profileService = inject(ProfileService) ) => {

    const filterProfiles = rxMethod<Record<string, any>>(
      pipe(
        switchMap(filter =>{
          return profileService.filterProfiles(filter)
            .pipe(
            tap(res=> patchState(state, {profiles: res.items}) )
            )
        })
      )
    )
    return {
      filterProfiles
    }
    }
  ),
  withHooks({
    onInit(store){
      store.filterProfiles({})
    }
  })
)
