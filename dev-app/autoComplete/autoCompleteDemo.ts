export class AutoCompleteDemo {
  sports: string[] = ['Badminton', 'Basketball', 'Cricket', 'Football', 'Golf', 'Gymnastics', 'Hockey', 'Rugby', 'Snooker', 'Tennis'];
  records = [
    { id: 'g1', game: 'Badminton' }, { id: 'g2', game: 'Basketball' }, { id: 'g3', game: 'Cricket' }
  ];
  fields = { value: 'game', text: 'game' };
  value: string = null;
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setValue() {
    this.value = 'Hockey';
  }
}
