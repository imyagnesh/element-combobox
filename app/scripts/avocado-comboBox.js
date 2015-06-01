(function () {

  var typingTimer;                //timer identifier
  var doneTypingInterval = 250;  //time in ms, 5 second for example

  Polymer({

    is: 'avocado-comboBox',

    properties: {

      data: {
        type: Array,
        //notify: false,
        value: function () {
          var data = [];
          for (var i = 0; i < 10000; i++) {
            data.push({
              name: faker.name.findName(),
              avatar: faker.internet.avatar()
            });
          }
          return data;
        }
      },

      displayAttr:{
        type: Array
      },

      multi: {
        type: Boolean,
        value:false
      },

      searchable: {
        type: Boolean,
        value: true
      },

      focused: {
        type: Boolean,
        value: true
      },

      clearable: {
        type: Boolean,
        value: true
      },

      placeholder: {
        type: String,
        value: 'Select...'
      },

      noResultsText: {
        type: String,
        value: 'No results found'
      },

      clearValueText: {
        type: String,
        value: 'Clear value'
      },

      clearAllText: {
        type: String,
        value: 'Clear all'
      },

      searchPromptText: {
        type: String,
        value: 'Type to search'
      },

      enabled: {
        type: Boolean,
        value: false
      },

      hostValue: {
        type: String,
        value: '',
        observer: 'changeHostValue'
      },

      disabled: {
        type: Boolean,
        value: false
      },

      isFocused: {
        type: Boolean,
        value: false
      },

      focusedOption: {
        type: Boolean,
        value: false
      },

      hasValue: {
        type: Boolean,
        value: false,
        observer: 'changeHasValue'
      },

      isOpen: {
        type: Boolean,
        value: false,
        observer: 'changeIsOpen'
      },

      cData: {
        type: Object,
        notify: true
      },

      /**
       * set height of div.
       */
      rowHeight: {
        type: Number,
        value: 40
      },

      /**
       * height of combo-box.
       */
      height: {
        type: Number,
        value: 200
      },
      /**
       * Initial position of scroll.
       */
      scrollTop: {
        type: Number,
        value: 0,
        notify: true,
        observer: 'changeScrollPosition'
      },
      /**
       * will set cells per page.
       */
      cellsPerPage: {
        type: Number,
        computed: 'computeCellsPerPage(height, rowHeight)'
      },
      /**
       * it update the total number of cells depend on ccount
       */
      numberOfCells: {
        type: Number,
        computed: 'computeNumberOfCells(cellsPerPage)'
      },
      /**
       * set position of fist div.
       */
      firstCell: {
        type: Number,
        value: 0
      },

      minimumInputLength: {
        type: Number,
        value: 2
      },

      noResultFound:{
        type: Boolean,
        value: false
      },

      resultHTML:{
        type: String,
        value: '<table><tr><td valign="middle"><div class="circular-image"><img src="{{avatar}}"></div></td><td valign="middle">{{name}}</td></tr></table>'
      }

    },

    convertHTML: function (resultHTML,item) {
      var res = resultHTML.replace(/\{{(.*?)\}}/g, function(g0,g1){ return item[g1]; });
      return res;
    },

    isMulti: function (multi) {
      return multi;
    },

    changeHostValue: function (newValue) {
      if(newValue.length > 0)
      {
        this.$$('#SelectPlaceholder').innerHTML = '';
        //this.placeholder = '';
      }
      else
      {
        this.$$('#SelectPlaceholder').innerHTML = this.placeholder;
        //this.placeholder = this.placeholderText;
      }
    },

    selectPlaceholder: function (multi,hasValue) {
      if(multi && !hasValue)
      {
        return true;
      }
      if(!multi)
      {
        return true;
      }
      return false;
    },

    changeIsOpen: function (newValue) {
      this.toggleSelectClass('is-open', newValue);
    },

    changeHasValue: function (newValue) {
      var self = this;
      self.toggleSelectClass('has-value', newValue);
      if (newValue) {
        this.$$('#SelectPlaceholder').innerHTML = '';
        var clearSelection = document.createElement('span');
        clearSelection.setAttribute('title', self.multi ? self.clearAllText : self.clearValueText);
        clearSelection.setAttribute('class', 'Select-clear');
        clearSelection.setAttribute('id', 'clearAll');
        clearSelection.innerHTML = '×';
        clearSelection.addEventListener('click', function() {
          self.$$('#SelectPlaceholder').innerHTML = self.placeholder;
          //self.placeholder = self.placeholderText;
          if(self.multi)
          {
            self.selected = [];
          }
          else
          {
            self.$.selector.deselect(self.selected);
          }
          self.hasValue = false;
        });
        Polymer.dom(self.$.selectControl).appendChild(clearSelection);
      }
      else {
        this.$$('#SelectPlaceholder').innerHTML = this.placeholder;
        var clearSelection = Polymer.dom(self.root).querySelector('span.Select-clear');
        if (clearSelection)
          Polymer.dom(self.$.selectControl).removeChild(clearSelection);
      }
    },

    toggleSelectClass: function (classname, toggleValue) {
      var select = Polymer.dom(this.root).querySelector('div.Select');
      this.toggleClass(classname, toggleValue, select);
    },

    handleMouseDown: function (event) {

      // if the event was triggered by a mousedown and not the primary
      // button, or if the component is disabled, ignore it.
      if (this.disabled || (event.type === 'mousedown' && event.button !== 0)) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();

      this.isOpen = true;
      Polymer.dom(this.root).querySelector('#search').focus();
    },

    handleKeyDown: function (event) {
      if (this.disabled) return;

      switch (event.keyCode) {

        case 8: // backspace
          //if (!this.state.inputValue) {
          //  this.popValue();
          //}
          return;

        //case 9: // tab
        //  if (event.shiftKey || !this.isOpen || !this.focusedOption) {
        //    return;
        //  }
        //  //this.selectFocusedOption();
        //  break;

        case 13: // enter
          //if (!this.state.isOpen) return
          //
          //this.selectFocusedOption();
          break;

        case 27: // escape
          //if (this.state.isOpen) {
          //  this.resetValue();
          //} else {
          //  this.clearValue();
          //}
          break;

        case 38: // up
          //this.focusPreviousOption();
          break;

        case 40: // down
          //this.focusNextOption();
          break;

        case 188: // ,
          //if (this.props.allowCreate) {
          //  event.preventDefault();
          //  event.stopPropagation();
          //  this.selectFocusedOption();
          //};
          break;

        default: return;
      }

      event.preventDefault();
    },

    onHovered: function (e) {
      this.focusedOption = true;
      e.target.classList.toggle('is-focused');
    },

    onUnhovered: function (e) {
      this.focusedOption = false;
      e.target.classList.toggle('is-focused');
    },

    focusDropDown: function () {
      this.isFocused = true;
      this.toggleSelectClass('is-focused', true);
    },

    blurDropDown: function (e) {
      var self = this;
      var _blurTimeout = setTimeout(function () {
        //if (true) return;
        self.toggleSelectClass('is-focused', false);
        self.isOpen = false;
      }, 50);
    },

    computeCellsPerPage: function (height, rowHeight) {
      return Math.round(height / rowHeight);
    },

    computeNumberOfCells: function (cellsPerPage) {
      return 3 * cellsPerPage;
    },

    computeClass: function (multi, searchable, isOpen, focused, disabled, hasValue) {
      var classString = 'Select';
      if (multi)
        classString += ' is-multi';
      if (searchable)
        classString += ' is-searchable';
      if (isOpen)
        classString += ' is-open';
      if (disabled)
        classString += ' is-disabled';
      if (hasValue)
        classString += ' has-value';
      return classString;
    },

    checkMinChar: function (hostValue, minimumInputLength) {
      return (hostValue.length >= minimumInputLength);
    },

    //ready: function () {
    //
    //  if (this.isDisabled) {
    //    var ironSelector = Polymer.dom(this.root).querySelector('span.select2-container');
    //    ironSelector.classList.add('select2-container--disabled');
    //  }
    //},

    searchVal: function () {
      //if (this.hostValue.length >= this.minimumInputLength) {
      var myApp = this;
      myApp.enabled = true;
      clearTimeout(typingTimer);
      typingTimer = setInterval(function () {
        clearTimeout(typingTimer);
        myApp.changeScrollPosition(0);
        myApp.enabled = false;
        myApp.isOpen = true;
      }, doneTypingInterval);
      //}
      //else {
      //  this.isOpen = false;
      //}
    },

    scrollData: function () {
      this.scrollTop = this.$.scroll.scrollTop;
    },

    computeTop: function (index) {
      return 'top: ' + (index * this.rowHeight) + 'px';
    },

    isSelected: function (item) {
      if (_.findIndex(this.selected, item) === -1) {
        return 'renderer';
      }
      else {
        return 'renderer selected';
      }
    },

    selectOption: function (e) {
      var item = Polymer.dom(this.root).querySelector('#domRepeat').itemForElement(e.target);
      this.$.selector.select(item);
      if(this.multi)
      {
        this.changeScrollPosition(this.$.scroll.scrollTop);
      }
      else
      {
        this.$$('#SelectPlaceholder').innerHTML = item.name;
        //this.placeholder = item.name;
        this.isOpen = false;
        this.scrollTop = 0;
        this.$.scroll.scrollTop = 0;
      }
      this.hostValue = '';
      this.hasValue = true;
    },

    removeItem: function (e) {
      var item = this.$$('#selectedRepeater').itemForElement(e.target);
      this.$.selector.select(item);
      if(this.selected.length > 0)
        this.hasValue = true;
      else
        this.hasValue = false;
    },

    changeScrollPosition: function (newValue, oldValue) {
      if (oldValue !== newValue) {
        var firstCell = Math.max(Math.floor(newValue / this.rowHeight) - this.cellsPerPage, 0);
        var cellsToCreate = Math.min(firstCell + this.numberOfCells, this.numberOfCells);
        var searchResult = this.searchData(this.hostValue, this.selected, firstCell, firstCell + cellsToCreate);
        if (searchResult.data.length > 0) {
          this.noResultFound = true;
        }
        else {
          this.noResultFound = false;
        }
        this.cData = searchResult.data;
        var ironSelector = Polymer.dom(this.root).querySelector('div.canvas');
        ironSelector.setAttribute('style', 'height: ' + searchResult.totalCount * this.rowHeight + 'px;');
        var childNodes = Polymer.dom(this.root).querySelectorAll('div.Select-option');
        for (var i = 0; i < childNodes.length; i++) {
          childNodes[i].setAttribute('style', 'top: ' + ((firstCell + i) * this.rowHeight) + 'px;');
        }
      }
    },

    //openDropDown: function (e) {
    //  var ddl = Polymer.dom(this.root).querySelector('span.select2');
    //  ddl.classList.toggle('select2-container--below');
    //  ddl.classList.toggle('select2-container--open');
    //  options = Polymer.dom(this.root).querySelector('iron-collapse>span.select2-container--open');
    //  options.setAttribute('style', 'position: absolute;top: '+ e.target.offsetParent.offsetTop + e.target.offsetParent.offsetHeight +';left: '+e.target.offsetParent.offsetLeft +';');
    //  this.isOpen = !this.isOpen;
    //  this.hostValue = '';
    //  this.scrollTop = 0;
    //  this.$.scroll.scrollTop = 0;
    //},

    searchData: function (input, selectedItems, startIndex, endIndex) {

      var searchResult = [];
      //if (input !== '') {
      searchResult = _.select(this.data, function (n) {
        return (n.name.toLowerCase().indexOf(input.toLowerCase()) > -1);
      });
      //}

      _.remove(searchResult, function (n) {
        return (_.findIndex(selectedItems, n) !== -1);
      });

      var service = {
        data: this.getIndexData(searchResult, startIndex, endIndex),
        totalCount: searchResult.length
      };
      return service;
    },

    getIndexData: function (searchResult, startIndex, endIndex) {
      return _.slice(searchResult, startIndex, endIndex);
    }


  });

})();