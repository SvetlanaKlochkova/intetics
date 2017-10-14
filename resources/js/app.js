var app = {};
(function () {
    var pageModel = {
        pageSize: 11,
        offset: 0,
        images: [],
        defaultTags: []
    };

    var modalModel = {

    }


    app.load = function (more) {
        $.ajax({
            method: "GET",
            url: "/images/all",
            processData: true,
            data: pageModel,
            success: function (data) {
                app.loadImages(data, more);
            }
        });
    }

    app.loadImages = function (images, more) {
        var htmlRows = images.map(function (image) {
            return '<div class="tr"><img src="/images/get/' + image.name + '"></div>';
        })
        if (!more) {
            imagesList.innerHTML = '<div class="tr"><a href="javascript:app.showModalWin(true);"><img src="/resources/images/add.jpg" /></a></div>';
        }
        imagesList.innerHTML += htmlRows.join('');
    }

    app.showModalWin = function (show) {
        if (show) {
            $('#popupWin').removeClass('hidden');
        } else {
            $('#popupWin').addClass('hidden');
        }
    }

    $(document).ready(function () {
        app.load(false);

        $('#selectTags').select2({
            ajax: {
                url: '/tags/',
                data: function (params) {
                    var query = {
                        name: params.term,
                    }
                    // Query parameters will be ?search=[term]&type=public
                    return query;
                },

                processResults: function (data) {
                    // Tranforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: data.map(function (item) { return { id: item.name, text: item.name } })
                    };
                }
                // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
            }

        });

        var drop = $('#file-thumbnail');
        var dropzone = new Dropzone('div#file-preview', {
            url: "/file/post",
            autoProcessQueue: false,
            previewContainer: "span.preview-file",
            thumbnailWidth: null,
            thumbnailHeight: $('div#file-preview').height() - 20,
            thumbnail: function (file, dataUrl) {
                drop.attr('src', dataUrl)
            },
            addedfile: function (file) {
                modalModel.file = file;
                $('#fileName').val(file.name)
            }
        });

        $('#publishButton').on('click', function () {
            var file = {
                'app-file_name': $('#fileName').val(),
                'app-file_type': modalModel.file.name.substring(modalModel.file.name.lastIndexOf('.')),
                'app-file_description': $('#fileDescription').val(),
                'app-file_tags': JSON.stringify($('#selectTags').val())
            }
            var url = ['/images/new'].join('/');
            var reader = new FileReader();
            reader.onload = (function (e) {
                $.ajax({
                    method: "POST",
                    url: url,
                    processData: false,
                    headers: file,
                    data: new Int8Array(e.target.result),
                    success: function (data) {
                        app.load(false);
                    }
                });
            });
            reader.readAsArrayBuffer(modalModel.file);
            app.showModalWin(false);
            // $.ajax({
            //     method: "POST",
            //     url: url,
            //     processData: false,
            //     data: new FormData(fileForm),
            //     success: function (data) {
            //         app.load();
            //     }
            // });

        })
    });
})()