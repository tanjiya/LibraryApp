$('#add-genre').click(function() {
    $.ajax({
        url: '/genre/create',
        type: 'POST',
        cache: false,
        data: {
            name: $('#name').val()
        },
        success: function() {
            $('#error-group').css('display', 'none');
        },
        error: function(data) {
            $('#error-group').css('display', 'block');
            var errors = JSON.parse(data.responseText);
            var errorsContainer = $('#errors');
            errorsContainer.innerHTML = '';
            var errorsList = '';

            for (var i = 0; i < errors.length; i++) {
                errorsList += '<li>' + errors[i].msg + '</li>';
            }
            errorsContainer.html(errorsList);
        }
    });
});