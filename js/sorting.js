// Sort the data on json level
var Sorting = {
	sourceData: '',
	sortedData: {},
	sortBy: '',
	sortOrder: 'desc',
	sortableRows: $('[data-sortlabel]'),
	init: function(jsonData) {
		var self = this;
		self.sourceData = jsonData; // Set the data in which needs to sort
		self.sortOrder = 'desc';

		self.sortAction(self);
	},
	// This will intialize the json key label for with the sort needs to happen by clicking on column
	sortAction: function(self) {
		$('[data-sortlabel]').off('click').on('click', function() {
			var thisCol = $(this);
			self.sortBy = thisCol.data('sortlabel');
			//thisCol.children('.sortIcon').hide();
			//thisCol.children('.sortingLoader').show();
			self.doSort(self, thisCol);
		});
	},
	// Actual sort will be done and again the pagination will take place for the sorted data
	doSort: function(self, thisCol) {
		self.sortedData = self.sourceData.sort(function(a, b) {
			valueType = typeof(a[self.sortBy]);
			
			if(valueType == 'string') {
				return ((a[self.sortBy].localeCompare(b[self.sortBy]) == -1) ? -1 : ((a[self.sortBy].localeCompare(b[self.sortBy]) == 1) ? 1 : 0));
			} else if(valueType == 'number') {
				return ((a[self.sortBy] < b[self.sortBy]) ? -1 : ((a[self.sortBy] > b[self.sortBy]) ? 1 : 0));
			} else if(valueType == 'boolean') {
				return (a[self.sortBy] - b[self.sortBy]);
			}
		});
		if(self.sortOrder == 'desc') {
			self.sortedData.reverse();
		}
		self.sortOrder = (self.sortOrder == 'desc') ? 'asc' : 'desc';
		//thisCol.children('.sortingLoader').hide();
		self.setSortingArrow(self, thisCol); // Call to set arrow
		pagination.setPerpageJson(self.sortedData); // Call to do the pagination on sorted data
	},
	// Set the asce or desc arrows on sort
	setSortingArrow: function(self, sortedCol) {
		self.sortableRows.children('.sortIcon').removeClass('fa-sort-desc fa-sort-asc active').addClass("fa-sort");
		if(self.sortOrder == 'asc') {
			sortedCol.children('.sortIcon').removeClass('fa-sort fa-sort-desc').addClass('fa-sort-asc active').show();
		} else {
			sortedCol.children('.sortIcon').removeClass('fa-sort fa-sort-asc').addClass('fa-sort-desc active').show();
		}
	}
}