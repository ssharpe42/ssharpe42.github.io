
// $(document).ready(function () {
//     $('#datatable').DataTable({
//         searching: false,
//         select: true,
//         info: false,
//         paging: false
//     });
// });

$(document).ready(function () {
    $('.dt').DataTable({
        searching: false,
        select: true,
        info: false,
        paging: false,
        "columnDefs": [{
            "targets": "_all",
            "class": "dt-col"
        }]
    });
});
