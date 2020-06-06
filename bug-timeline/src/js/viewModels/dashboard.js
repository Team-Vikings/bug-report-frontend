/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojtable','bug-timeline/loader'],
  function (ko, Bootstrap, ArrayDataProvider) {
    function DashboardViewModel() {
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
      self.bugNo(31199455);
      // var deptArray = [{Id:1,UpdDate:'2020-04-19T23:53:03.000Z',ProductId:2421,Status:11,StatusChanged:'N',ProdChanged:'N',StatusType:'Non-Terminal'}];
      // self.dataprovider = new ArrayDataProvider(deptArray, { keyAttributes: 'Id' })
      self.dataprovider = ko.observable();
      self.restApiURL = 'http://127.0.0.1:3000/api/BugClosedByUser/' + self.bugNo();
      self.data = ko.observableArray();
      $.getJSON(self.restApiURL).
        then(function (fetchData) {
          $.each(fetchData, function () {

            //debugger;
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
      //debugger;
      self.dataprovider = new ArrayDataProvider(self.data);
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
      self.validators = ko.computed(function () {
        return [{
          type: 'length',
          options: { min: 8, max: 8 }
        }];
      });

      // self.bugNoChanged = function (event) {
      //   var newBugNo = event.detail.value;
      //   // debugger;
      //   console.log("new bug no is " + newBugNo);
      //   self.restApiURL = 'http://127.0.0.1:3000/api/BugClosedByUser/' + newBugNo;
      //   self.data = ko.observableArray();
      //   $.getJSON(self.restApiURL).
      //     then(function (fetchData) {
      //       $.each(fetchData, function () {

      //         debugger;
      //         self.data.push({
      //           Id: this.ROWNUM,
      //           UpdDate: this.UPD_DATE,
      //           ProductId: this.NEW_PRODUCT_ID,
      //           Status: this.NEW_STATUS,
      //           StatusChanged: this.STATUS_CHANGED,
      //           ProdChanged: this.PROD_CHANGED,
      //           StatusType: this.STATUS_TYPE
      //         });
      //       });
      //     });
      //     debugger;
      //   self.dataprovider = new ArrayDataProvider(self.data, { keyAttributes: 'Id'});
      //   document.getElementById('tabid').refresh();
      // }


      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {

        document.title = "Dashboard";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }


    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
