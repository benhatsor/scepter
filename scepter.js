var scepter = {
  
  init: (elementsWrapper, shadow) => {
    
    const win = elementsWrapper.ownerDocument.defaultView,
          elements = elementsWrapper.querySelectorAll('*:not(scepter-element)'),

          overlay = shadow.querySelector('.overlay'),
          expandedOverlay = shadow.querySelector('.expanded--overlay'),

          inspector = shadow.querySelector('.inspector'),
          classOption = inspector.querySelector('.option.class'),
          consoleOption = inspector.querySelector('.option.console'),
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
        pressTimer = win.setTimeout(() => { selectElement(element) }, 350);
        return false;

      };

      function clearPressTimer() {

        win.clearTimeout(pressTimer);
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
        selectQueue.push(element);

        // deselect other elements
        let selectedElements = elementsWrapper.querySelectorAll('.seElected');

        selectedElements.forEach(elem => {
          elem.classList.remove('seElected');
        });

        selectQueue[0].classList.add('seElected');

        // override every click everywhere but selected element
        overlay.classList.add('visible');

        // move menu to element
        repositionMenu();


        let type = selectQueue[0].nodeName.toLowerCase(),
            classes = Array.from(selectQueue[0].classList),
            ids = selectQueue[0].id;

        let classString = '<' + type + '>';

        if (classes.length > 0) classString += '.' + classes.join('.');
        if (ids) classString += '#' + ids.split(' ').join('#');

        classOption.children[1].innerText = classString.replace('.seElected', '');

      }

    }

    // when clicked elsewhere than selected element
    overlay.addEventListener('click', () => {

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
    win.addEventListener('resize', repositionMenu, true);
    win.addEventListener('scroll', repositionMenu, true);

    function repositionMenu() {

      // if an element is selected
      if (selectQueue[0]) {

        // get position of element
        var rect = getPosRelToViewport(selectQueue[0]),
            height = selectQueue[0].clientHeight,
            elTop = rect.top + height,
            elLeft = rect.left;

        // menu boundry
        var scepterHeight = (inspector.clientHeight + 20),
            scepterWidth = inspector.clientWidth,
            
            maxTop = (win.innerHeight - (scepterHeight + 10)),
            minTop = (-10),
            
            maxLeft = (win.innerWidth - scepterWidth),
            minLeft = (20);
        
        // check if menu is outside window
        if (maxTop < elTop) elTop = maxTop;
        if (minTop > elTop) elTop = minTop;
        if (maxLeft < elLeft) elLeft = maxLeft;
        if (minLeft > elLeft) elLeft = minLeft;

        // move menu to element
        inspector.style.top = elTop + 'px';
        inspector.style.left = elLeft + 'px';

      }

    }

    // disable context menu
    win.addEventListener('contextmenu', event => event.preventDefault());

    function getPosRelToViewport(elem) {

      var rect = elem.getBoundingClientRect();

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

      // scroll to element
      element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});


      // show element title
      popoverType.innerText = classOption.children[1].innerText;


      // reset popover content
      popoverContent.innerHTML = '';
      
      
      // scroll to top of popover
      popoverContent.scrollTo(0, 0);



      // show classes and IDs of element
      let classes = Array.from(element.classList),
          ids = element.id;

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
      let children = Array.from(element.children);

      // if element has children
      if (children.length > 0) {

        // render HTML

        let renderedHTML = '<div class="title">' + (children.length == 1 ? 'Child' : 'Children') + '</div>';
        renderedHTML += '<div class="actions">';
        
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
      let parent = element.parentElement;

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
          win.setTimeout(() => {

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
            win.setTimeout(() => {
              popover.classList.remove('transitioning');
            }, 250);

          }, 300);

        })

      })

    }
    
    // hook logs and errors to console
    
    win.console.logs = [];
    
    win.console.stdlog = win.console.log.bind(win.console);
    win.console.log = function() {
      
      var argsArr = Array.from(arguments);
      
      win.console.logs.push({ content: argsArr, type: 'log' });
      win.console.stdlog.apply(win.console, argsArr);
      
      // if console is open
      if (popoverContent.querySelector('.log')) {
        
        // render console
        renderConsole();
        
      }
      
    };

    win.onerror = (error, url, line) => {
      
      win.console.logs.push({ content: (error + '\nURL:' + url + '. L:' + line), type: 'error' });
      
      // if console is open
      if (popoverContent.querySelector('.log')) {
        
        // render console
        renderConsole();
        
      }
      
    };
    
    function renderConsole() {
      
      // show title
      popoverType.innerText = 'Console';
      
      
      // scroll to bottom of popover
      popoverContent.scrollTo(0, popoverContent.scrollHeight);
      
      
      // render logs
      let renderedHTML = '';
      
      win.console.logs.forEach(log => {
        
        if (log.type == 'error') {
          
          renderedHTML += '<div class="log error">' + log.content + '</div>';
          
        } else {
          
          renderedHTML += '<div class="log">' + log.content + '</div>';
          
        }
        
      })
      
      popoverContent.innerHTML = renderedHTML;
      
    }
    
    // on click of 'console' option in inspector
    consoleOption.addEventListener('click', () => {

      // render console
      renderConsole();

      // expand overlay
      inspector.classList.add('expanded');

    });

    // when popover is open and clicked elsewhere than popover
    expandedOverlay.addEventListener('click', () => {

      // transition back correctly
      inspector.classList.add('transitioning');

      // close popover
      inspector.classList.remove('expanded');

      // reset transition when animation ended
      win.setTimeout(() => {
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
      win.setTimeout(() => {
        inspector.classList.remove('transitioning');
      }, 300 + 180);

    });
    
  }
  
}
