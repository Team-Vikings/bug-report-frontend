/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['accUtils', 'knockout', 'ojs/ojarraydataprovider',
  'ojs/ojconverter-datetime', 'ojs/ojvalidation-number', 'ojs/ojknockout', 'ojs/ojinputtext',
  'ojs/ojlabel', 'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojdialog', 'bug-timeline/loader'],
  function (accUtils, ko, ArrayDataProvider, DateTimeConverter) {

    function DashboardViewModel() {
      var self = this;
      self.bugURI = 'https://bug.oraclecorp.com/pls/bug/webbug_edit.edit_info_top?rptno=';
      self.assignee = ko.observable();
      self.data = ko.observableArray();
      self.dataprovider = ko.observable();
      self.days = ko.observable();
      self.rowSelected = ko.observable(false);
      self.rowSelectedVal = ko.observable();
      self.selectedBugNo = ko.observable();
      self.dateConverter = new DateTimeConverter.IntlDateTimeConverter({ "formatType": "date", "dateFormat": "long" });
      self.validators = ko.computed(function () {
        return [{
          type: 'length',
          options: { min: 3, max: 8 }
        }];
      });

      self.loadTable = function (event) {
        self.assignee(self.assignee().toUpperCase());
        self.data([]);
        self.dataprovider();
        if (self.assignee() != null && self.days() != null) {
          self.restApiURL = 'http://127.0.0.1:3000/api/BugClosedByUser/' + self.assignee() + '/' + self.days();
          $.getJSON(self.restApiURL).
            then(function (fetchData) {
              $.each(fetchData, function () {
                self.data.push({
                  BugNo: this.bugNo,
                  Status: this.status,
                  Subject: this.subject,
                  Customer: this.customer,
                  CloseDate: self.dateConverter.format(this.closeDate)
                });
              }
              )
            });
          self.dataprovider(new ArrayDataProvider(self.data, { keyAttributes: 'BugNo' }));
        }
      }

      self.rowSelectionChanged = function (event) {
        //get the bug no of the selected row
        if (event.detail.value.row.values().size !== 0) {
          self.selectedBugNo(event.detail.value.row.values().keys().next().value);
          self.rowSelected(true);
        }
        else {
          self.rowSelected(false);
        }
      }

      self.showBugTimelineDialog = function (event) {
        document.getElementById('bugTimelineDialog').open();
      }

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        accUtils.announce('Dashboard page loaded.');
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
