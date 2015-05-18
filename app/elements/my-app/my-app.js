var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms, 5 second for example

Polymer({

  is: 'my-app',

  properties: {

    /**
     * If true, collapse will open.
     */
    enabled: {
      type: Boolean,
      value: false
    },

    hostValue:{
      type: String,
      value: ''
    },

    isDisabled:{
      type: Boolean,
      value: false
    },

    isOpen:{
      type: Boolean,
      value: false
    },

    isMinChar: {
      type: Boolean,
      value: true
    },

    /**
     * list of combo-box data.
     */
    cData: {
      type: Object,
      notify: true
    },

    /**
     * set height of div.
     */
    rowHeight: {
      type: Number,
      value: 30
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
      notify: true
    },
    /**
     * will set cells per page.
     */
    cellsPerPage: {
      type: Number,
      value: 0
    },
    /**
     * it update the total number of cells depend on ccount
     */
    numberOfCells: {
      type: Number,
      value: 0
    },
    /**
     * set position of fist div.
     */
    firstCell: {
      type: Number,
      value: 0
    }
  },

  ready: function() {
    if(this.isDisabled)
    {
      var ironSelector = Polymer.dom(this.root).querySelector('span.select2-container');
      ironSelector.classList.add('select2-container--disabled');
    }
  },

  /**
   * Performs search data from combo-box.
   *
   * @event searchVal
   */
  searchVal: function () {
    if(this.$.search.value.length >= 2) {
      var myApp = this;
      myApp.enabled = true;
      myApp.isOpen = true;
      myApp.isMinChar = false;

      myApp.scrollTop = 0;
      clearTimeout(typingTimer);
      typingTimer = setInterval(function () {
        clearTimeout(typingTimer);
        myApp.cellsPerPage = Math.round(myApp.height / myApp.rowHeight);
        myApp.numberOfCells = 3 * myApp.cellsPerPage;
        myApp.updateDisplayList(myApp.hostValue);
        myApp.enabled = false;
      }, doneTypingInterval);
    }
    else{
      this.isMinChar = true;
      this.isOpen = false;
      this.updateDisplayList('');
    }
  },

  /**
   * Performs on scroll combo-box.
   *
   * @event scrollData
   */
  scrollData: function () {
    this.scrollTop = this.$.scroll.scrollTop;
    this.updateDisplayList(this.hostValue);
  },

  /**
   * Update display list on scroll and search.
   *
   * @method updateDisplayList
   */
  updateDisplayList: function (searchString) {
    var firstCell = Math.max(Math.floor(this.scrollTop / this.rowHeight) - this.cellsPerPage, 0);
    var cellsToCreate = Math.min(firstCell + this.numberOfCells, this.numberOfCells);
    var searchResult = this.$.service.searchData(searchString,this.selected, firstCell, firstCell + cellsToCreate);
    this.cData = searchResult.data;
    var ironSelector = Polymer.dom(this.root).querySelector('div.canvas');
    ironSelector.setAttribute('style', 'height: ' + searchResult.totalCount * this.rowHeight + 'px;');
    var childNodes = Polymer.dom(this.root).querySelectorAll('div.renderer');
    for (var i = 0; i < childNodes.length; i++) {
      childNodes[i].setAttribute('style', 'top: ' + ((firstCell + i) * this.rowHeight) + 'px;');
    }
  },

  /**
   * Performs Compute top style while initialize options.
   *
   * @method computeTop
   */
  computeTop: function (index) {
    return 'top: ' + (index * this.rowHeight) + 'px';
  },

  /**
   * Performs set class to div. if item is already selected then it add selected class.
   *
   * @event isSelected
   */
  isSelected: function (item) {
    if (_.findIndex(this.selected, item) === -1) {
      return 'renderer';
    }
    else {
      return 'renderer selected';
    }
  },

  /**
   * Performs select option on click div.
   *
   * @method selectOption
   */
  selectOption: function (e) {
    e.target.classList.toggle('selected');
    var item = this.$.dataRepeater.itemForElement(e.target);
    this.$.selector.select(item);
    this.hostValue = '';
    this.isOpen = false;
  },

  removeItem: function (e) {
    var item = this.$.selectedRepeater.itemForElement(e.target);
    this.$.selector.select(item);
  }



});
