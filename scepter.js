const elementsWrapper = document.querySelector('.html'),
      elements = elementsWrapper.querySelectorAll('*'),
      
      shadow = document.querySelector('scepter').shadowRoot,
      
      overlay = shadow.querySelector('.overlay'),
      expandedOverlay = shadow.querySelector('.expanded--overlay'),
      
      inspector = shadow.querySelector('.inspector'),
      classOption = inspector.querySelector('.option.class'),
      codeOption = inspector.querySelector('.option.code'),
      
      popover = shadow.querySelector('.popover'),
      popoverType = popover.querySelector('.type'),
      popoverClose = popover.querySelector('.close'),
      popoverContent = popover.querySelector('.content');

// set element press listeners
elements.forEach(element => {
  
  let pressTimer;

  function setPressTimer(e) {

    // on press of element
    pressTimer = window.setTimeout(() => { selectElement(element) }, 350);
    return false;

  };

  function clearPressTimer() {

    clearTimeout(pressTimer);
    return false;

  };

  element.addEventListener("mousedown", setPressTimer);
  element.addEventListener("touchstart", setPressTimer);

  element.addEventListener("mouseup", clearPressTimer);
  element.addEventListener("mouseout", clearPressTimer);
  element.addEventListener("touchend", clearPressTimer);
  element.addEventListener("touchleave", clearPressTimer);
  element.addEventListener("touchcancel", clearPressTimer);
  element.addEventListener("touchmove", clearPressTimer);
  
})

let selectQueue = [];

function selectElement(element) {
  
  // if element is not selected
  
  // note: "seElected" is not a typo. added on purpose to prevent targeting "selected" classes appearing naturally in websites.
  if (!element.classList.contains('seElected')) {

    // add element to queue
    selectQueue.unshift(element);

    // deselect other elements
    let selectedElements = elementsWrapper.querySelectorAll('.seElected');

    selectedElements.forEach(elem => {
      elem.classList.remove('seElected');
    });
    
    selectQueue[0].classList.add('seElected');
    
    // override every click everywhere but selected element
    overlay.classList.add('visible');
    
    // move menu to element
    var rect = getPosRelToViewport(selectQueue[0]),
        height = selectQueue[0].clientHeight,
        elTop = rect.top + height,
        elLeft = rect.left;

    inspector.style.top = elTop + 'px';
    inspector.style.left = elLeft + 'px';
    
    
    let type = selectQueue[0].nodeName.toLowerCase(),
        classes = Array.from(selectQueue[0].classList),
        ids = selectQueue[0].id;
    
    let classString = type;
    
    if (classes.length > 0) classString += '.' + classes.join('.');
    if (ids) classString += '#' + ids.split(' ').join('#');
    
    classOption.children[1].innerText = classString.replace('.seElected', '');

  }
  
}

// when clicked elsewhere than selected element
let clickOverride = overlay.addEventListener('click', () => {

  // deselect element
  let selectedElements = elementsWrapper.querySelectorAll('.seElected');
  
  selectedElements.forEach(elem => {
    elem.classList.remove('seElected');
  });
  
  overlay.classList.remove('visible');

  // remove element from queue
  selectQueue = [];

})

// reposition menu on window resize
window.addEventListener('resize', repositionMenu, true);
window.addEventListener('scroll', repositionMenu, true);

function repositionMenu() {
  
  // if an element is selected
  if (selectQueue[0]) {
      
    // move menu to element
    var rect = getPosRelToViewport(selectQueue[0]),
        height = selectQueue[0].clientHeight,
        elTop = rect.top + height,
        elLeft = rect.left;
    
    // check if menu is outside window
    if (elTop > window.innerHeight || elTop < 0) {
      console.log('Outside window');
    }
    
    inspector.style.top = elTop + 'px';
    inspector.style.left = elLeft + 'px';
    
  }
  
}

// disable context menu
elements.forEach(element => {
  element.addEventListener('contextmenu', event => event.preventDefault());
})

function getPosRelToViewport(elem) {
  
  var rect = elem.getBoundingClientRect();
  var win = elem.ownerDocument.defaultView;

  return {
    top: rect.top,
    left: rect.left
  };
  
}

// on click of 'class' option in inspector
classOption.addEventListener('click', () => {
  
  // render popover content
  renderPopover(selectQueue[0]);
  
  // expand overlay
  inspector.classList.add('expanded');
  
});

function renderPopover(element) {
  
  // show element title
  popoverType.innerText = '<' + element.nodeName.toLowerCase() + '>';
  
  
  // reset popover content
  popoverContent.innerHTML = '';
  
  
  
  // show classes and IDs of element
  let classes = Array.from(selectQueue[0].classList),
      ids = selectQueue[0].id;
    
  let classString = '';

  if (classes.length > 0) classString += ' .' + classes.join(' .');
  if (ids) classString += ' #' + ids.split(' ').join(' #');
  
  classString = classString.replace(' .seElected', '');
  
  // if element has classes
  if (classString && classString != ' .seElected') {
    
    // render HTML
    popoverContent.innerHTML += `<div class="item">
                                   <div class="desc">Classes and IDs</div>
                                   <div class="text">`+ classString +`</div>
                                 </div>`;
    
  }
  
  
  
  // show children of element
  let children = Array.from(selectQueue[0].children);
  
  // if element has children
  if (children.length > 0) {
    
    // render HTML
    
    let renderedHTML = '<div class="title">Children</div><div class="actions">';
    children.forEach(child => {
      
      // show classes and IDs of element
      let type = child.nodeName.toLowerCase(),
          classes = Array.from(child.classList),
          ids = child.id;

      let classString = type;

      if (classes.length > 0) classString += '.' + classes.join('.');
      if (ids) classString += '#' + ids.split(' ').join('#');
      
      renderedHTML += `<div class="action">
                         <div class="desc">`+ classString +`</div>
                         <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="icon"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z" fill="currentColor"></path></svg>
                       </div>`;
      
    })
        
    popoverContent.innerHTML += renderedHTML + '</div>';
    
  }


  
  // show parent of element
  let parent = selectQueue[0].parentElement;

  // if element has a parent
  if (parent && parent != elementsWrapper) {

    // render HTML

    let renderedHTML = '<div class="title">Parent</div><div class="actions">';

    // show classes and IDs of element
    let type = parent.nodeName.toLowerCase(),
        classes = Array.from(parent.classList),
        ids = parent.id;

    let classString = type;

    if (classes.length > 0) classString += '.' + classes.join('.');
    if (ids) classString += '#' + ids.split(' ').join('#');

    renderedHTML += `<div class="action parent">
                         <div class="desc">`+ classString +`</div>
                         <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="icon"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z" fill="currentColor"></path></svg>
                       </div>`;

    popoverContent.innerHTML += renderedHTML + '</div>';

  }
  
  
  
  // add action click listeners
  let actions = popoverContent.querySelectorAll('.action');

  actions.forEach((action, index) => {

    action.addEventListener('click', () => {

      // when clicked on action

      // hide popover
      popover.classList.add('hidden');

      // deselect element
      let selectedElements = elementsWrapper.querySelectorAll('.seElected');

      selectedElements.forEach(elem => {
        elem.classList.remove('seElected');
      });

      // remove element from queue
      selectQueue = [];

      // when animation ended
      window.setTimeout(() => {

        let actionElement = action.classList.contains('parent') ? parent : children[index];
        
        // select action element
        selectElement(actionElement);

        // render popover content
        renderPopover(actionElement);

        // transition back correctly
        popover.classList.add('transitioning');

        // show popover
        popover.classList.remove('hidden');

        // reset transition when animation ended
        window.setTimeout(() => {
          popover.classList.remove('transitioning');
        }, 250);

      }, 300);

    })

  })
  
}

// when popover is open and clicked elsewhere than popover
expandedOverlay.addEventListener('click', () => {
  
  // transition back correctly
  inspector.classList.add('transitioning');
  
  // close popover
  inspector.classList.remove('expanded');
  
  // reset transition when animation ended
  window.setTimeout(() => {
    inspector.classList.remove('transitioning');
  }, 300 + 180);
  
});

// when popover is open and clicked on close button 
popoverClose.addEventListener('click', () => {
  
  // transition back correctly
  inspector.classList.add('transitioning');
  
  // close popover
  inspector.classList.remove('expanded');
  
  // reset transition when animation ended
  window.setTimeout(() => {
    inspector.classList.remove('transitioning');
  }, 300 + 180);
  
});
