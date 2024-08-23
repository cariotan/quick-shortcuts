// Make a div containing the input and ul dropdown. set ul display to none. the id passed to the function is the id of the div container.
function initSelect(id) {
	let $propertyTypeSelect = $('#' + id);
	let $select = $propertyTypeSelect.find('input');
	let $ul = $propertyTypeSelect.find('ul').css("z-index", "9999");

	$select.on('focus', function () {
		$ul.show();
	});

	$ul.children().on('click', function () {
		$select.val($(this).text());
		$ul.hide();
	});

	$(document).on('click', function(event) {
		if(!$(event.target).closest('#' + id).length) {
			$ul.hide();
		}
	});
}
