// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Logout confirmation modal logic
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();
  });
}

// Delete listing confirmation modal logic
const deleteListingBtn = document.getElementById('deleteListingBtn');
const deleteListingForm = document.getElementById('deleteListingForm');
const confirmDeleteListing = document.getElementById('confirmDeleteListing');
if (deleteListingBtn && deleteListingForm && confirmDeleteListing) {
  deleteListingBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteListingModal'));
    deleteModal.show();
    confirmDeleteListing.onclick = function () {
      deleteListingForm.submit();
    };
  });
}

// Review delete confirmation modal logic
const reviewDeleteBtns = document.querySelectorAll('.review-delete-btn');
const confirmDeleteReviewBtns = document.querySelectorAll('.confirm-delete-review');

reviewDeleteBtns.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const reviewId = btn.getAttribute('data-review-id');
    const modal = new bootstrap.Modal(document.getElementById(`deleteReviewModal-${reviewId}`));
    modal.show();
  });
});

confirmDeleteReviewBtns.forEach(btn => {
  btn.addEventListener('click', function (e) {
    const reviewId = btn.getAttribute('data-review-id');
    const form = document.getElementById(`deleteReviewForm-${reviewId}`);
    if (form) {
      form.submit();
    }
  });
});