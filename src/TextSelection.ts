export class TextSelection {
  constructor(public start: number, public length: number) {}

  get end() {
    return this.start + this.length;
  }
}
