import { logEvent } from './qbLog';
import { Ej2QueryBuilder } from 'widgets/queryBuilder/ej2-queryBuilder';
import { viewResources } from 'aurelia-framework';

@viewResources(Ej2QueryBuilder)
export class QueryBuilderDemo {
  log = (name: string, e: CustomEvent) => logEvent(name, e);

  columns = [
    { field: 'EmployeeID', label: 'Employee ID', type: 'number' },
    { field: 'FirstName', label: 'First Name', type: 'string' },
    { field: 'TitleOfCourtesy', label: 'Title Of Courtesy', type: 'boolean', values: ['Mr.', 'Mrs.'] },
    { field: 'Title', label: 'Title', type: 'string' },
    { field: 'HireDate', label: 'Hire Date', type: 'date', format: 'dd/MM/yyyy' },
    { field: 'Country', label: 'Country', type: 'string' }
  ];

  // main demo: default functionalities
  mainRule: any = {
    condition: 'and',
    rules: [
      { label: 'Employee ID', field: 'EmployeeID', type: 'number', operator: 'equal', value: 1 },
      { label: 'Title', field: 'Title', type: 'string', operator: 'contains', value: 'Sales' }
    ]
  };
  newRule: any = {
    condition: 'or',
    rules: [{ label: 'Country', field: 'Country', type: 'string', operator: 'equal', value: 'USA' }]
  };
  applyNewRule() { this.mainRule = this.newRule; }
  destroyedCount = 0;
  onDestroyed() { this.destroyedCount++; }
  showMain = true;

  // data source: columns are derived from the data
  employees = [
    { EmployeeID: 1, FirstName: 'Nancy', Title: 'Sales Representative', Country: 'USA' },
    { EmployeeID: 2, FirstName: 'Andrew', Title: 'Vice President, Sales', Country: 'USA' },
    { EmployeeID: 3, FirstName: 'Janet', Title: 'Sales Representative', Country: 'UK' }
  ];

  // validation
  validationRule: any = {
    condition: 'and',
    rules: [{ label: 'First Name', field: 'FirstName', type: 'string', operator: 'equal', value: '' }]
  };

  // look & feel
  lookRule: any = {
    condition: 'and',
    rules: [{ label: 'Country', field: 'Country', type: 'string', operator: 'equal', value: 'USA' }]
  };
  readonly = false;
  mainButtons = { cloneGroup: true, cloneRule: true, lockGroup: true, lockRule: true, ruleDelete: true };
  lookButtons = { cloneGroup: false, cloneRule: false, lockGroup: false, lockRule: false, ruleDelete: false };
  validationColumns = [
    { field: 'FirstName', label: 'First Name', type: 'string', validation: { isRequired: true } },
    { field: 'Country', label: 'Country', type: 'string' }
  ];
  headerTemplate = '<div class="qb-header-tpl">Custom header</div>';
  fieldModel = { placeholder: 'Pick a field', popupHeight: '200px' };
  operatorModel = { placeholder: 'Pick an operator' };
  valueModel = { placeholder: 'Pick a value' };
}
