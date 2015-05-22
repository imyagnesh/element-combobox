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

      /**
       * If true, collapse will open.
       */
      enabled: {
        type: Boolean,
        value: false
      },

      hostValue: {
        type: String,
        value: ''
      },

      isDisabled: {
        type: Boolean,
        value: false
      },

      isOpen: {
        type: Boolean,
        value: false
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
      }

    },

    computeCellsPerPage: function (height, rowHeight) {
      return Math.round(height / rowHeight);
    },

    computeNumberOfCells: function (cellsPerPage) {
      return 3 * cellsPerPage;
    },

    checkMinChar: function (hostValue, minimumInputLength) {
      return (hostValue.length >= minimumInputLength);
    },

    ready: function () {

      if (this.isDisabled) {
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
      if (this.$.search.value.length >= this.minimumInputLength) {
      var myApp = this;
      myApp.enabled = true;
      clearTimeout(typingTimer);
      typingTimer = setInterval(function () {
        clearTimeout(typingTimer);
        myApp.changeScrollPosition(0);
        myApp.enabled = false;
        myApp.isOpen = true;
      }, doneTypingInterval);
      }
      else {
        this.isOpen = false;
      }
    },

    /**
     * Performs on scroll combo-box.
     *
     * @event scrollData
     */
    scrollData: function () {
      this.scrollTop = this.$.scroll.scrollTop;
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
      this.scrollTop = 0;
      this.$.scroll.scrollTop = 0;
      this.isOpen = false;
    },

    removeItem: function (e) {
      var item = this.$.selectedRepeater.itemForElement(e.target);
      this.$.selector.select(item);
    },

    changeScrollPosition: function (newValue, oldValue) {
      if (oldValue !== newValue) {
        var firstCell = Math.max(Math.floor(newValue / this.rowHeight) - this.cellsPerPage, 0);
        var cellsToCreate = Math.min(firstCell + this.numberOfCells, this.numberOfCells);
        var searchResult = this.searchData(this.hostValue, this.selected, firstCell, firstCell + cellsToCreate);
        this.cData = searchResult.data;
        var ironSelector = Polymer.dom(this.root).querySelector('div.canvas');
        ironSelector.setAttribute('style', 'height: ' + searchResult.totalCount * this.rowHeight + 'px;');
        var childNodes = Polymer.dom(this.root).querySelectorAll('div.renderer');
        for (var i = 0; i < childNodes.length; i++) {
          childNodes[i].setAttribute('style', 'top: ' + ((firstCell + i) * this.rowHeight) + 'px;');
        }
      }
    },

    searchData: function (input, selectedItems, startIndex, endIndex) {

      var searchResult = [];
      if (input !== '') {
        searchResult = _.select(this.data, function (n) {
          return (n.name.toLowerCase().indexOf(input.toLowerCase()) > -1);
        });
      }

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
    },
  });

})();
