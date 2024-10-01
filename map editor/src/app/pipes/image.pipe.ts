import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'versioned'
})
export class ImagePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value + '?v=1.0.0';
  }

}
