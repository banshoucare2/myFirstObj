export function notifyTodoRefresh(source) {
    const message = { type: 'TODO_REFRESH_EV', data: { key: 'todo:after' } };
  
    console.log('message from ' + source);
    console.log(window.location.href + ' ' + window.document.title);
    console.log(window.parent.location.href + ' ' + window.parent.document.title);
  
    window.MY_CUSTOM_ID = 'base-components_origin';
    window.parent.MY_CUSTOM_ID = 'parent_window';
    window.parent.parent.MY_CUSTOM_ID = 'grand_parent_window';
  
    if (!window.parent) {
      console.error('window.parent is not accessible.');
      return; // Exit early if window.parent is not accessible
    }
  
    if (window.parent.location.href.includes('/todo/leaseAfterTodo')) {
      window.parent.postMessage(message, '*');
    } else if (window.parent.parent) {
      window.parent.parent.postMessage(message, '*');
    } else {
      console.error('Neither window.parent nor window.parent.parent is accessible or valid.');
    }
  }