// Render data which received from json, this data will be paginated / sorted
var renderData = {
	sourceData: '',
	tableDataContainer: '', // Main container (tbody) where all the rows will be appended
	tableRow: '', // Row structure which will be used to create other rows
	init: function (dataRow, rowStructure) {
		var self = this;
		self.tableDataContainer = (dataRow.length) ? dataRow : $('.dataRow:visible');
		self.tableRow = (rowStructure.length) ? rowStructure : $('.rowStructure');
	},
	// Render the data to dom
	renderProcessedData: function(data, tableDataContainer, tableRow) {
		var self = this;
		self.init(tableDataContainer, tableRow); // Intialize the container and table row

		var copiedTableRow, key;

		self.tableDataContainer.empty();
		$.each(data, function(index, value) {
			copiedTableRow = self.tableRow.html(); // This will reassign the row structure after every single row rendered to DOM

			for(key in value) {
				copiedTableRow = copiedTableRow.replace(new RegExp('-'+key+'-', 'g'), value[key]);
			}
			self.tableDataContainer.append(copiedTableRow);
		});
	}
}