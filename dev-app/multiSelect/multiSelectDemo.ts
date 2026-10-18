export class MultiSelectDemo {
  sports = [
    { id: 'Game1', game: 'American Football' }, { id: 'Game2', game: 'Badminton' }, { id: 'Game3', game: 'Basketball' },
    { id: 'Game4', game: 'Cricket' }, { id: 'Game5', game: 'Football' }, { id: 'Game6', game: 'Golf' }
  ];
  fields = { text: 'game', value: 'id' };
  values: string[] = ['Game2', 'Game4'];
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValues() {
    this.values = ['Game1'];
  }
}
