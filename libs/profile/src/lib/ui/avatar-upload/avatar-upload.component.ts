import { Component, signal } from '@angular/core';
import { DndDirective } from '../../../../../common-ui/src/lib/directives/dnd.directive';
import { ReactiveFormsModule } from '@angular/forms';
import {SvgIconComponent} from '@tt/shared';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent, DndDirective, ReactiveFormsModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/images/avatar-placeholder.png');

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.proccesFile(file);
  }

  onFileDropped(file: File) {
    this.proccesFile(file);
  }

  file!: File | null | undefined;

  proccesFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;
    this.file = file;
    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);
  }
}
