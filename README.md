# Introduction
Where most of the plugins do the pagination, sorting or searching after loading all the content to DOM which is useful if you have bunch of data but if we talk about 1000s of data then you will get some lag on redirecting to different page number and also in sorting, so to solve this problem its better to do all this functionality before loading data to DOM, which this plugin do. It will get whole JSON data and will render only 1st page of data to DOM, as user clicks on next page it will render that page of data and so on. Same for Sorting and Searching, both are done in JSON level only and after that only data renders to DOM.

### Easy to use
Here I am using bootstrap table and fontawesome icons, its upto you if you want to replace it with something else:
```
<!-- Bootstrap css -->
<link rel="stylesheet" href="lib/css/bootstrap.min.css">
<!-- Bootstrap Optional theme -->
<link rel="stylesheet" href="lib/css/bootstrap-theme.min.css">
<!-- Font awesome  -->
<link href="lib/css/font-awesome.min.css" rel="stylesheet">
<!-- jQuery Library -->
<script src="lib/javascript/jquery.min.js"></script>
<!-- Bootstrap JavaScript -->
<script src="lib/javascript/bootstrap.min.js"></script>
```

##### HTML Block
```
<div class="input-group" style="width: 250px; float: left">
	<input type="text" class="form-control" name="onPageSearch" id="onPageSearch" placeholder="Name...">
	<span class="input-group-btn">
		<input type="button" class="btn btn-default ingroupBtn" name="searchBtn" value="Search">
	</span>
</div><!-- /input-group -->
<input type="button" class="btn btn-warning" name="clearSearch" value="Clear Search" style="float: left">

<table class="table table-condensed table-hover">
	<thead>
		<tr>
			<th width="300" data-sortlabel="name">Name <i class="fa sortIcon fa-sort"></i></th>
			<th width="150" data-sortlabel="age">Age <i class="fa sortIcon fa-sort"></i></th>
			<th width="200" data-sortlabel="city">City <i class="fa sortIcon fa-sort"></i></th>
		</tr>
	</thead>
	<tbody class="dataRow">
	</tbody>
</table>
<div class="pagination_block"></div>
```
**Here class _.dataRow_ will contain the list & _.pagination_block_ will contain the pagination number**

##### Table row template
```
<script type="text/template" class="rowStructure">
	<tr>
		<td>-name-</td>
		<td>-age-</td>
		<td>-city-</td>
	</tr>
</script>
```
**Plugin will search for _.rowStructure_ to embed it to table & those -name- -age- & -city- are the json object which will get replaced by the actual value in json**

##### Required javascript files & code
```
<script src="javascript/pagination.js"></script>
<script src="javascript/sorting.js"></script>
<script src="javascript/onPageSearch.js"></script>
<script src="javascript/renderData.js"></script>

<script type="text/javascript">
	// Sample json object
	var json = [{"name": "Dheeraj Agrawal", "age": 27, "city": "Pune"}, {"name": "Umang Paunikar", "age": 27, "city": "RJN"}, {"name": "Sanjay Meravi", "age": 29, "city": "RJN"}, {"name": "Neeraj Jha", "age": 29, "city": "Durg"}, {"name": "Awhan Patnaik", "age": 37, "city": "Kolkata"}, {"name": "Prasad Mohite", "age": 26, "city": "Pune"}, {"name": "Mahesh Gawali", "age": 31, "city": "Delhi"}, {"name": "Mayur", "age": 35, "city": "Pune"}, {"name": "Prajyot Phate", "age": 23, "city": "Pune"}, {"name": "Mahendra Jadhav", "age": 25, "city": "Rajkot"}, {"name": "Prashant Agrawal", "age": 31, "city": "Ahmedabad"}, {"name": "Pankaj Agrawal", "age": 28, "city": "Gondia"}, {"name": "Mohit", "age": 27, "city": "Raipur"}];

	// Pagination intialization, here 5 is the per page data count
	pagination.init(json, 5);
	// Sorting - It will sort on every column which have data-sortlabel attribute which contains json object name
	Sorting.init(json); 
	// Searching - By default it will search on name, if you want to use search for anything else, pass the json object name as 2nd orgument i.e. onpageSearch.init(json, 'city')
	onpageSearch.init(json); 
</script>
```
Thanks,
Please comment if any issues
