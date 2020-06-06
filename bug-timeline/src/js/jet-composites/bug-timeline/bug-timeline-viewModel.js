/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
define(
  ['knockout', 'ojL10n!./resources/nls/bug-timeline-strings', 'ojs/ojcontext', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojknockout', 'ojs/ojtable'],
  function (ko, componentStrings, Context, ArrayDataProvider) {

    function ExampleComponentModel(context) {
      var self = this;

      //At the start of your viewModel constructor
      var busyContext = Context.getContext(context.element).getBusyContext();
      var options = { "description": "Web Component Startup - Waiting for data" };
      self.busyResolve = busyContext.addBusyState(options);

      self.composite = context.element;

      //Example observable
      //self.messageText = ko.observable('Hello from bug-timeline');
      self.properties = context.properties;
      self.res = componentStrings['bug-timeline'];
      var self = this;
      var statusMap = new Map();
      statusMap.set(10, 'NT');
      statusMap.set(11, 'O');
      statusMap.set(30, 'O');
      statusMap.set(31, 'NT');
      statusMap.set(32, 'NT');
      statusMap.set(33, 'NT');
      statusMap.set(35, 'NT');
      statusMap.set(36, 'NT');
      statusMap.set(37, 'NT');
      statusMap.set(39, 'NT');
      statusMap.set(40, 'NT');
      statusMap.set(44, 'NT');
      statusMap.set(51, 'O');
      statusMap.set(52, 'NT');
      statusMap.set(54, 'NT');
      statusMap.set(66, 'O');
      statusMap.set(71, 'ST');
      statusMap.set(72, 'ST');
      statusMap.set(78, 'ST');
      statusMap.set(81, 'ST');
      statusMap.set(84, 'T');
      statusMap.set(90, 'T');
      statusMap.set(91, 'T');
      statusMap.set(92, 'T');
      statusMap.set(93, 'T');
      statusMap.set(96, 'T');
      self.bugNo = ko.observable();
      // var deptArray = [{Id:1,UpdDate:'2020-04-19T23:53:03.000Z',ProductId:2421,Status:11,StatusChanged:'N',ProdChanged:'N',StatusType:'Non-Terminal'}];
      // self.dataprovider = new ArrayDataProvider(deptArray, { keyAttributes: 'Id' })
      self.dataprovider = ko.observable();
      self.tabId = 'tabid';
      if (context.properties.bugNo) {
        debugger;
        self.bugNo(context.properties.bugNo);
        self.restApiURL = 'http://127.0.0.1:3000/api/BugClosedByUser/' + self.bugNo();
        self.data = ko.observableArray();
        $.getJSON(self.restApiURL).
          then(function (fetchData) {
            $.each(fetchData, function () {
              self.data.push({
                UpdDate: this.UPD_DATE,
                ProductId: this.NEW_PRODUCT_ID,
                Status: this.NEW_STATUS,
                StatusChanged: this.STATUS_CHANGED,
                ProdChanged: this.PROD_CHANGED,
                StatusType: statusMap.get(this.NEW_STATUS)
              });
            });
          });
        self.dataprovider = new ArrayDataProvider(self.data);

      }

      // Example for parsing context properties
      // if (context.properties.name) {
      //     parse the context properties here
      // }

      //Once all startup and async activities have finished, relocate if there are any async activities
      self.busyResolve();
    };

    //Lifecycle methods - uncomment and implement if necessary 
    //ExampleComponentModel.prototype.activated = function(context){
    //};

    //ExampleComponentModel.prototype.connected = function(context){
    //};

    //ExampleComponentModel.prototype.bindingsApplied = function(context){
    //};

    //ExampleComponentModel.prototype.disconnect = function(context){
    //};

    //ExampleComponentModel.prototype.propertyChanged = function(context){
    //};

    return ExampleComponentModel;
  });