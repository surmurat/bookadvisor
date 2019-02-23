$(document).ready(function () {
    $('body').bootstrapMaterialDesign();
});

function showError(message) {
    swal({
        title: 'Error',
        text: message,
        icon: 'error',
        dangerMode: 'true'
    });
}

function showSuccess(message) {
    swal({
        title: 'Success',
        text: message,
        icon: 'success'
    })
}

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

(function ($) {
    $.fn.showLoadingScreen = () => {
        $(this).block({
            message: '<div class="lds-ripple"><div></div><div></div></div><br/><h4>Loading</h4>',
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: '.5',
                color: '#fff',
                fontSize: '18px',
                fontFamily: 'Verdana,Arial',
                fontWeight: 200,
            }
        });
    };
    $.fn.hideLoadingScreen = () => {
        $(this).unblock();
    };
}(jQuery));