import {Injectable, signal} from '@angular/core';
import {Profile} from '@tt/data-access/profile';

@Injectable({
  providedIn: 'root'
})
export class GlobalStoreService {
  me = signal<Profile| null>(null)
}
