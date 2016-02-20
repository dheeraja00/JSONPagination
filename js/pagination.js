// Pagination api, it paginate on the level of json data before loading it to DOM
var pagination = {
	sourceData: '',
	tableDataContainer: '',
	tableRow: '',
	reportLoader: '',
	paginationContainer: $('.pagination_block:not(.searchedpagination)'), // Pagination container
	perPageEntry: 20, // Per page data count, default value is here which can be change by sending in init function
	totalJsonEntries: 0, // Total number of json data received, default 0
	totalPages: 0,
	currentPage: 0, // Programatically page number starts from zero
	lastPage: 0,
	firstEntryPoint: 0,
	lastEntrypoint: this.perPageEntry,
	visiblePageButtonCount: 5,
	paginatiorButtonContainer: '',
	paginationList: '',
	paginationBtnTemplate: '<nav><ul class="pagination">'+
			'<li class="disabled nav_previous"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>'+
			'-pageButton-'+
			'<li class="disabled nav_next"><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>'+
		'</ul></nav>',
	ajaxUrl: '',
	init: function (jsonData, perPageData, dataRow, rowStructure, paginationBlock, shownoRecord, paginationAjaxUrl) {
		var self = this;
		self.sourceData = jsonData;
		self.totalJsonEntries = (self.sourceData) ? self.sourceData.length : 0;
		self.perPageEntry = (perPageData) ? perPageData : self.perPageEntry;
		self.paginationContainer = (paginationBlock) ? paginationBlock : self.paginationContainer;
		self.ajaxUrl = (paginationAjaxUrl) ? paginationAjaxUrl : '';
		self.tableDataContainer = (dataRow) ? dataRow : $('.dataRow:visible');
		self.tableRow = (rowStructure) ? rowStructure : $('.rowStructure');

		// Total page count using number od json data received and per-page entries & that count will also be the last page value
		if(self.totalJsonEntries && !self.ajaxUrl) {
			self.intializeDefaultValues(self);
			var exactPages = self.totalJsonEntries / self.perPageEntry;
			self.totalPages = self.lastPage = parseInt((exactPages % self.perPageEntry === 0) ? exactPages : exactPages + 1);
			self.setPerpageJson();
			if(self.totalPages > 0) {
				self.createPaginationBar(self);
				self.navigation(self);
				self.setPreviousNextNav(self);
			} else {
				self.paginationContainer.empty();	
			}
		} else if(self.ajaxUrl) {
			self.callPaginationApi(self);
		}
	},
	// In this function all the intialization will be done for the global
	intializeDefaultValues: function(self) {
		self.totalPages = 0;
		self.currentPage = 0;
		self.lastPage = 0;
		self.firstEntryPoint = 0;
		self.lastEntrypoint = self.perPageEntry;
		self.paginatiorButtonContainer = '';
		self.paginationList = '';
	},
	// This is for the ajax pagination
	callPaginationApi: function(self) {
		$.ajax({
			url: self.ajaxUrl+'&pageno='+(self.currentPage + 1),
			type: 'GET',
			contentType: 'application/json',
			success: function(data) {
				if(data.length) {
					self.totalJsonEntries = data[data.length - 1].total_records;
					var exactPages = self.totalJsonEntries / self.perPageEntry;
					self.totalPages = self.lastPage = parseInt((exactPages % self.perPageEntry === 0) ? exactPages : exactPages + 1);
					if(self.totalPages > 0) {
						self.createPaginationBar(self);
						self.navigation(self);
						self.setPreviousNextNav(self);
					} else {
						self.paginationContainer.empty();	
					}

					renderData.renderProcessedData(data, self.tableDataContainer, self.tableRow);
				}
			},
			error: function(jqXHR, status, errorThrown) {
				console.log("Error" + status);
			}
		});
	},
	// Slice the json as per the per page value and the current page
	setPerpageJson: function(sortedData) {
		var self = this;

		if(!self.ajaxUrl) {
			var copiedSourceData = self.sourceData = (sortedData) ? sortedData : self.sourceData;

			if(self.totalJsonEntries > self.perPageEntry) {
				self.firstEntryPoint = self.currentPage * self.perPageEntry;
				self.lastEntrypoint = (self.currentPage * self.perPageEntry) + self.perPageEntry;

				copiedSourceData = copiedSourceData.slice(self.firstEntryPoint, self.lastEntrypoint);
			}
			renderData.renderProcessedData(copiedSourceData, self.tableDataContainer, self.tableRow);
		} else {
			self.callPaginationApi(self);
		}
	},
	// Calculate total number of data and the pages that can be created out of available data & create the pagination button
	createPaginationBar: function(self) {
		var allPageButton = '';
		var copiedPaginationTemplate = self.paginationBtnTemplate;
		var currentPage = self.currentPage + 1;
		var thisPage = 0;
		var endPage = 0;
		var extraClass;
		self.paginationContainer.empty();

		// Calculation for page the page buttons to show
		if(self.totalPages <= 5 || currentPage <= 3) {
			thisPage = 1;
			endPage = (self.totalPages > 5) ? 5 : self.totalPages;
		} else {
			if(self.totalPages - currentPage < 2) {
				thisPage = (self.totalPages - currentPage == 1) ? currentPage - 3 : currentPage - 4;
			} else {
				thisPage = (currentPage - 2 >= 0) ? currentPage - 2 : currentPage;	
			}
			
			endPage = (self.totalPages - currentPage >= 2) ? currentPage + 2 : self.totalPages;
		}
		for(var page = thisPage; page <= endPage; page++) {
			extraClass = '';
			if(page == currentPage) {
				extraClass = 'class="active"';
			}
			allPageButton += '<li ' + extraClass + ' data-pageno="' + page + '"><a href="#">' + page + '</a></li>';
		}
		if(allPageButton) {
			copiedPaginationTemplate = copiedPaginationTemplate.replace('-pageButton-', allPageButton);
		}
		self.paginationContainer.append(copiedPaginationTemplate);
		self.paginatiorButtonContainer = self.paginationContainer.find('.pagination');
		self.paginationList = self.paginatiorButtonContainer.children('li:not(.nav_previous, .nav_next)');
	},
	// Make paginator work i.e. it should navigate between pages, programatically page number starts from zero
	navigation: function(self) {
		self.paginationContainer.off('click', '[data-pageno]').on('click', '[data-pageno]', function(event) {
			event.preventDefault();
			var selectedPage = self.currentPage = parseInt($(this).data('pageno')) - 1;

			if(self.ajaxUrl) {
				if(self.reportLoader.length) {
					self.reportLoader.show();
				}
			}
			self.paginationList.removeClass('active');
			//$(this).addClass('active');
			self.setPerpageJson();

			self.createPaginationBar(self);
			self.setPreviousNextNav(self);
		});
	},
	// Create Previous & Next links
	setPreviousNextNav: function (self) {
		if(self.totalPages > 1) {
			if(self.currentPage > 0) {
				self.paginatiorButtonContainer.find('.nav_previous').removeClass('disabled').attr('data-pageno', self.currentPage);
			} else {
				self.paginatiorButtonContainer.find('.nav_previous').addClass('disabled').removeData('pageno');
			}

			if((self.currentPage + 1) < self.totalPages) {
				self.paginatiorButtonContainer.find('.nav_next').removeClass('disabled').attr('data-pageno', self.currentPage + 2);
			} else {
				self.paginatiorButtonContainer.find('.nav_next').addClass('disabled').removeData('pageno');
			}
		}
	}
}