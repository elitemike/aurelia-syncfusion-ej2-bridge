import { ProgressButtonModel } from '@syncfusion/ej2-splitbuttons';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { observable } from 'aurelia-binding';
import { Ej2Button } from 'widgets/button/ej2-button';
import { GridModel } from '@syncfusion/ej2-grids';
import { RouterConfiguration, Router } from "aurelia-router";
import { PLATFORM } from 'aurelia-pal';
import { autoinject } from 'aurelia-framework';

@autoinject
export class App {

  configureRouter(config: RouterConfiguration, router: Router) {
    config.options.root = "/";
    config.options.pushState = true;
    config.map([
      { route: "", redirect: "home" },
      { route: "home", name: "home", moduleId: PLATFORM.moduleName("home") },
      { route: "accordion", name: "accordion", moduleId: PLATFORM.moduleName("accordion/accordionDemo") },
      { route: "autoComplete", name: "autoComplete", moduleId: PLATFORM.moduleName("autoComplete/autoCompleteDemo") },
      { route: "button", name: "button", moduleId: PLATFORM.moduleName("button/buttonDemo") },
      { route: "checkbox", name: "checkbox", moduleId: PLATFORM.moduleName("checkbox/checkboxDemo") },
      { route: "dashboardLayout", name: "dashboardLayout", moduleId: PLATFORM.moduleName("dashboardLayout/dashboardLayoutDemo") },
      { route: "datePicker", name: "datePicker", moduleId: PLATFORM.moduleName("datePicker/datePickerDemo") },
      { route: "dateRangePicker", name: "dateRangePicker", moduleId: PLATFORM.moduleName("dateRangePicker/dateRangePickerDemo") },
      { route: "dateTimePicker", name: "dateTimePicker", moduleId: PLATFORM.moduleName("dateTimePicker/dateTimePickerDemo") },
      { route: "dropDownList", name: "dropDownList", moduleId: PLATFORM.moduleName("dropDownList/dropDownListDemo") },
      { route: "grid", name: "grid", moduleId: PLATFORM.moduleName("grid/gridDemo") },
      { route: "listView", name: "listview", moduleId: PLATFORM.moduleName("listView/listViewDemo") },
      { route: "maskedTextBox", name: "maskedTextBox", moduleId: PLATFORM.moduleName("maskedTextBox/maskedTextBoxDemo") },
      { route: "numericTextBox", name: "numericTextBox", moduleId: PLATFORM.moduleName("numericTextBox/numericTextBoxDemo") },
      { route: "progressButton", name: "progressButton", moduleId: PLATFORM.moduleName("progressButton/progressButtonDemo") },
      { route: "radio", name: "radio", moduleId: PLATFORM.moduleName("radio/radioDemo") },
      { route: "slider", name: "slider", moduleId: PLATFORM.moduleName("slider/sliderDemo") },
      { route: "switch", name: "switch", moduleId: PLATFORM.moduleName("switch/switchDemo") },
      { route: "textBox", name: "textBox", moduleId: PLATFORM.moduleName("textBox/textBoxDemo") },
      { route: "timePicker", name: "timePicker", moduleId: PLATFORM.moduleName("timePicker/timePickerDemo") },
      { route: "treeView", name: "treeView", moduleId: PLATFORM.moduleName("treeView/treeViewDemo") },
      { route: "uploader", name: "uploader", moduleId: PLATFORM.moduleName("uploader/uploaderDemo") }
    ]);
  }

  // @observable
  // isChecked = false
  // @observable
  // rdo1Checked = false;
  // @observable
  // rdo2Checked = true;
  // buttonDisabled = false;
  // index = 0;
  // isPrimary = true;
  // myContent = "blah"
  // isToggle = false;
  // ej2Button: Ej2Button = null;
  // gridDataSource = data;
  // gridColumns = [
  //   { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120, type: 'number' },
  //   { field: 'CustomerID', width: 140, headerText: 'Customer ID', type: 'string' },
  //   { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C' },
  //   { field: 'OrderDate', headerText: 'Order Date', width: 140, format: 'yMd' }
  // ];

  // gridModel: GridModel = {

  // }

  // progressButtonModel: ProgressButtonModel = {

  //   created: () => { this.onCreated(); },
  //   spinSettings: { position: "Right" }
  // };


  // onCreated() {
  //   console.log("progress created")
  // }

  // buttonModel: ButtonModel = {

  // };

  // buttonClick(a) {
  //   console.log("button clicked from custom event", a);
  //   this.isChecked = !this.isChecked;
  //   this.myContent = "button clicked";
  // }

  // progressClicked() {
  //   // console.log("progress clicked")
  //   this.ej2Button.refresh();
  // }

  // checkboxClick($event) {
  //   console.log("checkbox clicked", $event);
  //   return true;
  // }

  // isCheckedChanged() {
  //   // console.log("checkbox changed - new value", this.isChecked);
  // }

  // rdo1CheckedChanged() {
  //   // console.log("radio 1 changed - new value", this.rdo1Checked);
  //   this.buttonDisabled = this.rdo1Checked;
  // }

  // rdo2CheckedChanged() {
  //   //   console.log("radio 2 changed - new value", this.rdo2Checked);
  //   this.isToggle = true;

  // }


}


export let data: Object[] = [
  {
    OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
    ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
    ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
  },
  {
    OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
    ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
    ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
  },
  {
    OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, OrderDate: new Date(8367642e5),
    ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
    ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
  },
  {
    OrderID: 10251, CustomerID: 'VICTE', EmployeeID: 3, OrderDate: new Date(8367642e5),
    ShipName: 'Victuailles en stock', ShipCity: 'Lyon', ShipAddress: '2, rue du Commerce',
    ShipRegion: 'CJ', ShipPostalCode: '69004', ShipCountry: 'France', Freight: 41.34, Verified: !0
  },
  {
    OrderID: 10252, CustomerID: 'SUPRD', EmployeeID: 2, OrderDate: new Date(8368506e5),
    ShipName: 'Suprêmes délices', ShipCity: 'Charleroi', ShipAddress: 'Boulevard Tirou, 255',
    ShipRegion: 'CJ', ShipPostalCode: 'B-6000', ShipCountry: 'Belgium', Freight: 51.3, Verified: !0
  },
  {
    OrderID: 10253, CustomerID: 'HANAR', EmployeeID: 7, OrderDate: new Date(836937e6),
    ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
    ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 58.17, Verified: !0
  },
  {
    OrderID: 10254, CustomerID: 'CHOPS', EmployeeID: 5, OrderDate: new Date(8370234e5),
    ShipName: 'Chop-suey Chinese', ShipCity: 'Bern', ShipAddress: 'Hauptstr. 31',
    ShipRegion: 'CJ', ShipPostalCode: '3012', ShipCountry: 'Switzerland', Freight: 22.98, Verified: !1
  },
  {
    OrderID: 10255, CustomerID: 'RICSU', EmployeeID: 9, OrderDate: new Date(8371098e5),
    ShipName: 'Richter Supermarkt', ShipCity: 'Genève', ShipAddress: 'Starenweg 5',
    ShipRegion: 'CJ', ShipPostalCode: '1204', ShipCountry: 'Switzerland', Freight: 148.33, Verified: !0
  },
  {
    OrderID: 10256, CustomerID: 'WELLI', EmployeeID: 3, OrderDate: new Date(837369e6),
    ShipName: 'Wellington Importadora', ShipCity: 'Resende', ShipAddress: 'Rua do Mercado, 12',
    ShipRegion: 'SP', ShipPostalCode: '08737-363', ShipCountry: 'Brazil', Freight: 13.97, Verified: !1
  },
  {
    OrderID: 10257, CustomerID: 'HILAA', EmployeeID: 4, OrderDate: new Date(8374554e5),
    ShipName: 'HILARION-Abastos', ShipCity: 'San Cristóbal', ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
    ShipRegion: 'Táchira', ShipPostalCode: '5022', ShipCountry: 'Venezuela', Freight: 81.91, Verified: !0
  },
  {
    OrderID: 10258, CustomerID: 'ERNSH', EmployeeID: 1, OrderDate: new Date(8375418e5),
    ShipName: 'Ernst Handel', ShipCity: 'Graz', ShipAddress: 'Kirchgasse 6',
    ShipRegion: 'CJ', ShipPostalCode: '8010', ShipCountry: 'Austria', Freight: 140.51, Verified: !0
  },
  {
    OrderID: 10259, CustomerID: 'CENTC', EmployeeID: 4, OrderDate: new Date(8376282e5),
    ShipName: 'Centro comercial Moctezuma', ShipCity: 'México D.F.', ShipAddress: 'Sierras de Granada 9993',
    ShipRegion: 'CJ', ShipPostalCode: '05022', ShipCountry: 'Mexico', Freight: 3.25, Verified: !1
  },
  {
    OrderID: 10260, CustomerID: 'OTTIK', EmployeeID: 4, OrderDate: new Date(8377146e5),
    ShipName: 'Ottilies Käseladen', ShipCity: 'Köln', ShipAddress: 'Mehrheimerstr. 369',
    ShipRegion: 'CJ', ShipPostalCode: '50739', ShipCountry: 'Germany', Freight: 55.09, Verified: !0
  },
  {
    OrderID: 10261, CustomerID: 'QUEDE', EmployeeID: 4, OrderDate: new Date(8377146e5),
    ShipName: 'Que Delícia', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua da Panificadora, 12',
    ShipRegion: 'RJ', ShipPostalCode: '02389-673', ShipCountry: 'Brazil', Freight: 3.05, Verified: !1
  },
  {
    OrderID: 10262, CustomerID: 'RATTC', EmployeeID: 8, OrderDate: new Date(8379738e5),
    ShipName: 'Rattlesnake Canyon Grocery', ShipCity: 'Albuquerque', ShipAddress: '2817 Milton Dr.',
    ShipRegion: 'NM', ShipPostalCode: '87110', ShipCountry: 'USA', Freight: 48.29, Verified: !0
  }];
