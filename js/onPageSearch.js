// On page search and render it, this search happens in json
var onpageSearch = {
	singleFieldSearch: true,
	searchField: $('[name=onPageSearch]'),
	searchButton: $('[name=searchBtn]'),
	clearSearchBtn: $('[name=clearSearch]'),
	searchData: '',
	searchText: '',
	searchJsonKey: 'name',
	init: function (jsonData, searchJsonObjKey) {
		var self = this;

		self.searchData = (jsonData) ? jsonData : self.searchData;
		self.searchJsonKey = (searchJsonObjKey) ? searchJsonObjKey : self.searchJsonKey;

		self.getSearchResult(self);

		// Clear search
		self.clearSearchBtn.on('click', function() {
			self.searchField.val('');

			pagination.init(self.searchData, pagination.perPageEntry, $('.dataRow'), $('.rowStructure'), $('.pagination_block'), true);
			Sorting.init(self.searchData);
		});
	},
	getSearchResult: function(self) {
		var newFilteredData;
		self.searchButton.on('click', function() {
			// Get the search text for searching in the json
			self.searchText = self.searchField.val().toLowerCase();
			newFilteredData = self.searchData.filter(function(key) {
				return key[self.searchJsonKey].toLowerCase().indexOf(self.searchText) != -1;
			});

			// Check for no result
			if(!newFilteredData.length) {
				self.noRecordFound(self);
			}

			pagination.init(newFilteredData, pagination.perPageEntry, $('.dataRow'), $('.rowStructure'), $('.pagination_block:not(.searchedpagination)'));
			Sorting.init(newFilteredData);
		});
	},
	// Message for no record found, show if zero json entries
	noRecordFound: function(self) {
		var colSpanCount = $('.dataRow').parent().children('thead').find('th').length;
		$('.dataRow').empty().append('<tr class="error_message"><td colspan="'+colSpanCount+'" class="cell_center_align">No Merchants found</td></tr>');
		$('.pagination_block').empty();
	}
}