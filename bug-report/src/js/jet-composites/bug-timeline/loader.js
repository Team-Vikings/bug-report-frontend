/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
define(['ojs/ojcomposite', 'text!./bug-timeline-view.html', './bug-timeline-viewModel', 'text!./component.json', 'css!./bug-timeline-styles'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('bug-timeline', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);