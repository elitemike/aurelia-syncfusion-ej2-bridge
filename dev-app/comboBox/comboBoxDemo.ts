export class ComboBoxDemo {
  games = [
    { id: 'Game1', game: 'American Football' }, { id: 'Game2', game: 'Badminton' },
    { id: 'Game3', game: 'Basketball' }, { id: 'Game4', game: 'Cricket' }, { id: 'Game5', game: 'Football' }
  ];
  fields = { text: 'game', value: 'id' };
  value: string = 'Game2';
  enabled = true;
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = 'Game5';
  }
}
