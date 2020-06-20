/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
define(
  ['knockout', 'ojL10n!./resources/nls/bug-timeline-strings', 'ojs/ojcontext', 'ojs/ojarraydataprovider',
    'ojs/ojconverter-datetime',
    'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojgantt', 'ojs/ojlegend'],
  function (ko, componentStrings, Context, ArrayDataProvider, DateTimeConverter) {

    function BugTimelineComponentModel(context) {
      var currentModuleProductId = 2422;
      var self = this;
      const sysDate = new Date();
      const convertUnit = 1000 * 3600 * 24;
      self.dateConverter = new DateTimeConverter.IntlDateTimeConverter({ "formatType": "date", "dateFormat": "long" });
      var red = '#ff3333';
      var orange = '#ffb833';
      var yellow = '#ffff00';
      var green = '#00b300';//'#33ff33';
      var grey = '#999999';
      var brown = '#cb3434';
      var firstSemiTerminal = true;
      var colours = [{ desc: "Bug is in opened state", colour: red },
      { desc: "Bug is in non-terminal state like 3x", colour: orange },
      { desc: "Bug is in semi-terminal state like 7x", colour: yellow },
      { desc: "Bug is in terminal state like 9x", colour: green },
      { desc: "Bug is not with current module", colour: grey },
      { desc: "Bug is in terminal state and with other module", colour: brown }];
      this.legendDataProvider = new ArrayDataProvider(colours, { keyAttributes: 'desc' });

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
      self.data = ko.observableArray();
      // static data for testing
      // self.testminUpdateDate = new Date("Apr 1, 2020").toISOString();
      // self.testmaxUpdateDate = new Date("Dec 31, 2020").toISOString();
      // var deptArray = [{
      //   UpdDate: '2020-04-19T23:53:03.000Z', ProductId: 2421, Status: 11, StatusChanged: 'N', ProdChanged: 'N', StatusType: 'NT',
      //   NextUpdDate: '2020-04-21T08:51:51.000Z', Colour: '#ff3333'
      // }];
      // self.testData = new ArrayDataProvider(deptArray)
      self.dataprovider = ko.observable();
      self.ganttId = 'ganttid';
      var minTempUpdateDate = new Date();
      minTempUpdateDate.setDate(minTempUpdateDate.getDate() - 100);
      self.minUpdateDate = ko.observable(minTempUpdateDate.toISOString());
      var maxTempUpdateDate = new Date();
      maxTempUpdateDate.setDate(maxTempUpdateDate.getDate() + 100);
      self.maxUpdateDate = ko.observable(maxTempUpdateDate.toISOString());
      self.resetData = function () {
        self.data([]);
        self.dataprovider();
        self.minUpdateDate(minTempUpdateDate.toISOString());
        self.maxUpdateDate(maxTempUpdateDate.toISOString());
        debugger;
      }
      //debugger;
      self.loadGanttChart = function (bugNo) {
        self.resetData();
        debugger;
        self.bugNo(bugNo);
        self.restApiURL = 'http://127.0.0.1:3001/api/BugClosedByUser/' + self.bugNo();
        var tempArray = [];
        $.getJSON(self.restApiURL).
          then(function (fetchData) {
            $.each(fetchData, function () {
              var productFlag;
              switch (this.PROD_CHANGED) {
                case "ETI":
                  productFlag = "Other module transferred bug";
                  break;
                case "ETO":
                  productFlag = "Bug transferred to other module";
                  break;
                case "ETR":
                  productFlag = "Other module transferred bug back";
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
            self.minUpdateDate(new Date(tempArray[0].UpdDate).toISOString());
            var endDate = new Date(tempArray[tempArray.length - 1].UpdDate);
            endDate.setDate(endDate.getDate() + 7); //add 7 days
            self.maxUpdateDate((endDate < sysDate ? endDate : sysDate).toISOString());
            for (var i = 0; i < tempArray.length - 1; i++) {
              var curVal = tempArray[i];
              var curUpdateDate = new Date(curVal.UpdDate);
              var nextUpdDate = new Date(tempArray[i + 1].UpdDate);
              var daysDiff = (nextUpdDate.getTime() - curUpdateDate.getTime()) / convertUnit;
              //split the record if status is in Semi terminal and diff of update dates is more than 7 
              //to be used by colouring module
              if (curVal.StatusType == 'ST' && Math.round(daysDiff) > 7) {
                var nextWeekDate = new Date(curVal.UpdDate);
                nextWeekDate.setDate(nextWeekDate.getDate() + 7); //add 7 days
                self.data.push({
                  UpdDate: curUpdateDate.toISOString(),
                  ProductId: curVal.ProductId,
                  Status: curVal.Status,
                  StatusChanged: curVal.StatusChanged,
                  ProdChanged: curVal.ProdChanged,
                  StatusType: curVal.StatusType,
                  NextUpdDate: nextWeekDate.toISOString(),
                  Duration: (nextWeekDate.getTime() - curUpdateDate.getTime()) / convertUnit,
                  Colour: getColour(curVal.StatusType, curVal.ProductId)
                });
                self.data.push({
                  UpdDate: nextWeekDate.toISOString(),
                  ProductId: curVal.ProductId,
                  Status: curVal.Status,
                  StatusChanged: curVal.StatusChanged,
                  ProdChanged: curVal.ProdChanged,
                  StatusType: curVal.StatusType,
                  NextUpdDate: nextUpdDate.toISOString(),
                  Duration: (nextUpdDate.getTime() - nextWeekDate.getTime()) / convertUnit,
                  Colour: getColour(curVal.StatusType, curVal.ProductId)
                });
              }
              else {
                self.data.push({
                  UpdDate: curUpdateDate.toISOString(),
                  ProductId: curVal.ProductId,
                  Status: curVal.Status,
                  StatusChanged: curVal.StatusChanged,
                  ProdChanged: curVal.ProdChanged,
                  StatusType: curVal.StatusType,
                  NextUpdDate: nextUpdDate.toISOString(),
                  Duration: (nextUpdDate.getTime() - curUpdateDate.getTime()) / convertUnit,
                  Colour: getColour(curVal.StatusType, curVal.ProductId)
                });

              }
            }
            var curVal = tempArray[i];
            var finalDate = new Date(curVal.UpdDate);
            finalDate.setDate(finalDate.getDate() + 7); //add 7 days
            //if last row is ST, inserts extra row to show terminal closure
            if (curVal.StatusType == 'ST' && finalDate < sysDate) {

              var finalDateST = new Date(curVal.UpdDate);
              finalDateST.setDate(finalDateST.getDate() + 14); //add 14 days
              self.data.push({
                UpdDate: new Date(curVal.UpdDate).toISOString(),
                ProductId: curVal.ProductId,
                Status: curVal.Status,
                StatusChanged: curVal.StatusChanged,
                ProdChanged: curVal.ProdChanged,
                StatusType: curVal.StatusType,
                NextUpdDate: finalDate.toISOString(),
                Duration: (finalDate.getTime() - new Date(curVal.UpdDate).getTime()) / convertUnit,
                Colour: getColour(curVal.StatusType, curVal.ProductId)
              });
              self.data.push({
                UpdDate: finalDate.toISOString(),
                ProductId: curVal.ProductId,
                Status: curVal.Status,
                StatusChanged: curVal.StatusChanged,
                ProdChanged: curVal.ProdChanged,
                StatusType: curVal.StatusType,
                NextUpdDate: (finalDateST < sysDate ? finalDateST : sysDate).toISOString(),
                Duration: ((finalDateST < sysDate ? finalDateST : sysDate).getTime() - finalDate.getTime()) / convertUnit,
                Colour: getColour(curVal.StatusType, curVal.ProductId)
              });
            }
            else {
              self.data.push({
                UpdDate: new Date(curVal.UpdDate).toISOString(),
                ProductId: curVal.ProductId,
                Status: curVal.Status,
                StatusChanged: curVal.StatusChanged,
                ProdChanged: curVal.ProdChanged,
                StatusType: curVal.StatusType,
                NextUpdDate: (finalDate < sysDate ? finalDate : sysDate).toISOString(),
                Duration: ((finalDate < sysDate ? finalDate : sysDate).getTime() - new Date(curVal.UpdDate).getTime()) / convertUnit,
                Colour: getColour(curVal.StatusType, curVal.ProductId)
              });
            }
          });
        self.dataprovider(new ArrayDataProvider(self.data));
      }
      if (self.properties.bugNo) {
        self.loadGanttChart(self.properties.bugNo);
      }

      // Example for parsing context properties
      // if (context.properties.name) {
      //     parse the context properties here
      // }

      //Once all startup and async activities have finished, relocate if there are any async activities
      self.busyResolve();
    };

    //Lifecycle methods - uncomment and implement if necessary 
    //BugTimelineComponentModel.prototype.activated = function(context){
    //};

    //BugTimelineComponentModel.prototype.connected = function(context){
    //};

    //BugTimelineComponentModel.prototype.bindingsApplied = function(context){
    //};

    //BugTimelineComponentModel.prototype.disconnect = function(context){
    //};

    BugTimelineComponentModel.prototype.propertyChanged = function (context) {
      this.loadGanttChart(context.value);
    };

    return BugTimelineComponentModel;
  });