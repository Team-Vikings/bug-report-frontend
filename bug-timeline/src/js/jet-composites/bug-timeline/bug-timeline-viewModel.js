/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
define(
  ['knockout', 'ojL10n!./resources/nls/bug-timeline-strings', 'ojs/ojcontext', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojknockout', 'ojs/ojtable'],
  function (ko, componentStrings, Context, ArrayDataProvider) {

    function ExampleComponentModel(context) {
      var currentModuleProductId = 2422;
      var self = this;
      var red = '#ff3333';
      var orange = '#ffb833';
      var yellow = '#ffff00';
      var green =  '#00b300';//'#33ff33';
      var grey = '#999999';
      var brown = '#cb3434';
      var firstSemiTerminal = true;

      function getColour(StatusType, ProductId) {
        if (StatusType == 'ST') {
          if (firstSemiTerminal) {
            firstSemiTerminal = false;
            return ProductId == currentModuleProductId ? yellow : grey;
          }
          else {
            //after 7 days, ST is considered as terminal closure
            return ProductId == currentModuleProductId ? green : brown;
          }
        }
        firstSemiTerminal = true;
        if (StatusType == 'O') {
          return ProductId == currentModuleProductId ? red : grey;
        }
        if (StatusType == 'NT') {
          return ProductId == currentModuleProductId ? orange : grey;
        }
        if (StatusType == 'T') {
          return ProductId == currentModuleProductId ? green : brown;
        }
      }

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
      statusMap.set(80, 'T');
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
        self.bugNo(context.properties.bugNo);
        self.restApiURL = 'http://127.0.0.1:3000/api/BugClosedByUser/' + self.bugNo();
        self.data = ko.observableArray();
        var tempArray = [];
        $.getJSON(self.restApiURL).
          then(function (fetchData) {
            $.each(fetchData, function () {
              var productFlag;
              switch(this.PROD_CHANGED){
                case "ETI":
                  productFlag = "Other module transferred bug";
                  break;
                case "ETO":
                  productFlag = "Bug transferred to other module";
                  break;
                case "ETR":
                  productFlag = "Other module transferred back the bug";
                  break;
                default:
                  productFlag = null;
              }
              tempArray.push({
                UpdDate: this.UPD_DATE,
                ProductId: this.NEW_PRODUCT_ID,
                Status: this.NEW_STATUS,
                StatusChanged: this.STATUS_CHANGED,
                ProdChanged: productFlag,
                StatusType: statusMap.get(this.NEW_STATUS)
              });
            });
            //debugger;
            for (var i = 0; i < tempArray.length - 1; i++) {
              var curVal = tempArray[i];
              var curUpdateDate = new Date(curVal.UpdDate);
              var nextUpdDate = new Date(tempArray[i + 1].UpdDate);
              var daysDiff = (nextUpdDate.getTime() - curUpdateDate.getTime()) / (1000 * 3600 * 24);
              //split the record if status is in Semi terminal and diff of update dates is more than 7 
              //to be used by colouring module
              if (curVal.StatusType == 'ST' && Math.round(daysDiff) > 7) {
                var nextWeekDate = new Date(curVal.UpdDate);
                nextWeekDate.setDate(nextWeekDate.getDate() + 7); //add 7 days
                self.data.push({
                  UpdDate: curUpdateDate,
                  ProductId: curVal.ProductId,
                  Status: curVal.Status,
                  StatusChanged: curVal.StatusChanged,
                  ProdChanged: curVal.ProdChanged,
                  StatusType: curVal.StatusType,
                  NextUpdDate: nextWeekDate,
                  Colour: getColour(curVal.StatusType, curVal.ProductId)
                });
                self.data.push({
                  UpdDate: nextWeekDate,
                  ProductId: curVal.ProductId,
                  Status: curVal.Status,
                  StatusChanged: curVal.StatusChanged,
                  ProdChanged: curVal.ProdChanged,
                  StatusType: curVal.StatusType,
                  NextUpdDate: nextUpdDate,
                  Colour: getColour(curVal.StatusType, curVal.ProductId)
                });
              }
              else {
                self.data.push({
                  UpdDate: curUpdateDate,
                  ProductId: curVal.ProductId,
                  Status: curVal.Status,
                  StatusChanged: curVal.StatusChanged,
                  ProdChanged: curVal.ProdChanged,
                  StatusType: curVal.StatusType,
                  NextUpdDate: nextUpdDate,
                  Colour: getColour(curVal.StatusType, curVal.ProductId)
                });

              }
            }
            var curVal = tempArray[i];
            var sysDate = new Date();
            var finalDate = new Date(curVal.UpdDate);
            finalDate.setDate(finalDate.getDate() + 7); //add 7 days
            //if last row is ST, inserts extra row to show terminal closure
            if (curVal.StatusType == 'ST' && finalDate < sysDate) {

              var finalDateST = new Date(curVal.UpdDate);
              finalDateST.setDate(finalDateST.getDate() + 14); //add 14 days
              self.data.push({
                UpdDate: new Date(curVal.UpdDate),
                ProductId: curVal.ProductId,
                Status: curVal.Status,
                StatusChanged: curVal.StatusChanged,
                ProdChanged: curVal.ProdChanged,
                StatusType: curVal.StatusType,
                NextUpdDate: finalDate,
                Colour: getColour(curVal.StatusType, curVal.ProductId)
              });
              self.data.push({
                UpdDate: finalDate,
                ProductId: curVal.ProductId,
                Status: curVal.Status,
                StatusChanged: curVal.StatusChanged,
                ProdChanged: curVal.ProdChanged,
                StatusType: curVal.StatusType,
                NextUpdDate: finalDateST < sysDate ? finalDateST : sysDate,
                Colour: getColour(curVal.StatusType, curVal.ProductId)
              });
            }
            else {
              self.data.push({
                UpdDate: new Date(curVal.UpdDate),
                ProductId: curVal.ProductId,
                Status: curVal.Status,
                StatusChanged: curVal.StatusChanged,
                ProdChanged: curVal.ProdChanged,
                StatusType: curVal.StatusType,
                NextUpdDate: finalDate < sysDate ? finalDate : sysDate,
                Colour: getColour(curVal.StatusType, curVal.ProductId)
              });
            }
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