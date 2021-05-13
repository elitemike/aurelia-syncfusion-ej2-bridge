import { observable } from 'aurelia-binding';
import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';
import { ListViewModel, ListView } from "@syncfusion/ej2-lists";
import { virtualizationData } from './datasource';

export class ListViewDemo {
  modelForTemplate: ListViewModel = {};
  dataSource: any[] = [];
  @observable streamingWidget: IEJ2WidgetBridge<ListView> = null;

  model: ListViewModel = {
    dataSource: nestedListData,

    //Map appropriate columns to fields property
    fields: { iconCss: 'icon', tooltip: 'text' },

    //Set true to show icons
    showIcon: true,

    //Set header title
    headerTitle: 'Folders',

    //Set true to show header title
    showHeader: true,
    showCheckBox: true
  };

  throttle = (fn, delay) => {
    let lastCalled = 0;
    return (...args) => {
      let now = new Date().getTime();
      if(now - lastCalled < delay) {
        return;
      }
      lastCalled = now;
      return fn(...args);
    }
  }

  debounce(func: () => void, wait: number, immediate?: boolean): () => void {
    let timeout: any = null;
    return function (): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context: {} = this;
        // eslint-disable-next-line prefer-rest-params
        const args = arguments;

        const later = function (): void {
            timeout = null;
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            if (!immediate) func.apply(context, <[]>(<any>args));
        };

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        if (callNow) func.apply(context, <[]>(<any>args));
    };
}

  throttleRefresh: ()=> void = null;
  debounceRefresh: () => void = null;


 
  constructor() {
    let _this = this;
    this.throttleRefresh = this.throttle(() => {
      _this.streamingWidget.widget.refresh(); 
      _this.streamingWidget.widget.element.scrollTo(0, _this.streamingWidget.widget.element.scrollHeight)
    }, 1000);
    this.debounceRefresh = this.debounce(() => {
      _this.streamingWidget.widget.refresh(); 
      _this.streamingWidget.widget.element.scrollTo(0, _this.streamingWidget.widget.element.scrollHeight)
    }, 1500);
   
    let template: string = '<div class="e-list-wrapper e-list-avatar">' +
      '<span>${timestamp}</span> <span>[${severity}]</span> <span>${message}</span>  </div>';

    this.dataSource.push({ timestamp: Date(), severity: "info", message: "initial message" })

    this.modelForTemplate = {
      dataSource: this.dataSource,

      //enable UI virtualization
      enableVirtualization: true,

      //Set built-in cssClass for templates
      cssClass: 'e-list-template',

      //Set height
      height: 500,

      //Set defined customized template
      template: template
    }; 
  }

  streamingWidgetChanged() {
    if (this.streamingWidget) {
     this.addEntry();
    }
  }

  entryCount = 0;
  maxEntries = 2000;
  addEntry(){
    let _this = this;
    this.entryCount++;
    this.dataSource.push({ timestamp: Date(), severity: "info", message: `streamed message ${this.entryCount}` });
    if(this.streamingWidget.widget){
      this.throttleRefresh();
      this.debounceRefresh();
    }
    if(this.entryCount <this.maxEntries){     
      setTimeout(() => {
        _this.addEntry()
      }, 10);
    }
  }
}


export let nestedListData: { [key: string]: Object }[] = [
  {
    id: '01', text: 'Music', icon: 'folder',
    child: [
      { id: '01-01', text: 'Gouttes.mp3', icon: 'file' }
    ]
  },
  {
    id: '02', text: 'Videos', icon: 'folder',
    child: [
      { id: '02-01', text: 'Naturals.mp4', icon: 'file' },
      { id: '02-02', text: 'Wild.mpeg', icon: 'file' },
    ]
  },
  {
    id: '03', text: 'Documents', icon: 'folder',
    child: [
      { id: '03-01', text: 'Environment Pollution.docx', icon: 'file' },
      { id: '03-02', text: 'Global Water, Sanitation, & Hygiene.docx', icon: 'file' },
      { id: '03-03', text: 'Global Warming.ppt', icon: 'file' },
      { id: '03-04', text: 'Social Network.pdf', icon: 'file' },
      { id: '03-05', text: 'Youth Empowerment.pdf', icon: 'file' },
    ]
  },
  {
    id: '04', text: 'Pictures', icon: 'folder',
    child: [
      {
        id: '04-01', text: 'Camera Roll', icon: 'folder',
        child: [
          { id: '04-01-01', text: 'WIN_20160726_094117.JPG', icon: 'file' },
          { id: '04-01-02', text: 'WIN_20160726_094118.JPG', icon: 'file' },
          { id: '04-01-03', text: 'WIN_20160726_094119.JPG', icon: 'file' }
        ]
      },
      {
        id: '04-02', text: 'Wind.jpg', icon: 'file'
      },
      {
        id: '04-02', text: 'Stone.jpg', icon: 'file'
      },
      {
        id: '04-02', text: 'Home.jpg', icon: 'file'
      },
      {
        id: '04-02', text: 'Bridge.png', icon: 'file'
      }
    ]
  },
  {
    id: '05', text: 'Downloads', icon: 'folder',
    child: [
      { id: '05-01', text: 'UI-Guide.pdf', icon: 'file' },
      { id: '05-02', text: 'Tutorials.zip', icon: 'file' },
      { id: '05-03', text: 'Game.exe', icon: 'file' },
      { id: '05-04', text: 'TypeScript.7z', icon: 'file' },
    ]
  },
];
