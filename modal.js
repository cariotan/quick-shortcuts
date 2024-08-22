// The modal content div should have class hidden.
function initModal(id) {
	let $errorModal = $('#' + id);

	let $modal = $('<div class="fixed inset-0 flex justify-center items-center" style="display: none; z-index: 10000">');
	let $backdrop = $('<div class="fixed inset-0 bg-black/80" style="opacity: 0"></div>');

	$errorModal.wrap($modal).css({ opacity: 0 }).removeClass('hidden');
	$modal = $errorModal.parent();
	$modal.prepend($backdrop);

	$backdrop.on('click', closeModal);

	function openModal() {
		$errorModal.css({ scale: 0.5 });
		$modal.show();
		$backdrop.transition({ opacity: 1 });
		$errorModal.transition({ opacity: 1, scale: 1 });
	}

	function closeModal() {
		$backdrop.transition({ opacity: 0 });
		$errorModal.transition({ opacity: 0, scale: 0.5 });
		setTimeout(function () {
			$modal.hide()
		}, 400)
	}

	let modal = {
		openModal: openModal,
		closeModal: closeModal,
	};

	return modal;
} 
