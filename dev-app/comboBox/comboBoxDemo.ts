import { ComboBoxModel } from "@syncfusion/ej2-dropdowns";

export class ComboBoxDemo {


  private dataSource = null;

  private model: ComboBoxModel = {
    fields: { text: 'Game', value: 'Id' },
    // set the placeholder to ComboBox input element
    placeholder: 'Select a game',
    // sort the resulted items
    sortOrder: 'Ascending',
    // set the height of the popup element
    popupHeight: '230px',
    // enable the autofill property to fill a first matched value in input when press a down key
    autofill: true
  };

  attached() {
    this.dataSource = [
      { "Id": "Game1", "Game": "American Football" },
      { "Id": "Game2", "Game": "Badminton" },
      { "Id": "Game3", "Game": "Basketball" },
      { "Id": "Game4", "Game": "Cricket" },
      { "Id": "Game5", "Game": "Football" },
      { "Id": "Game6", "Game": "Golf" },
      { "Id": "Game7", "Game": "Hockey" },
      { "Id": "Game8", "Game": "Rugby" },
      { "Id": "Game9", "Game": "Snooker" },
      { "Id": "Game10", "Game": "Tennis" }
    ];
  }
}
