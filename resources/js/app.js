var app = {};
(function () {
    var queryModel = {
        pageSize: 11,
        offset: 0,
        more: true,

    };
    var pageModel = {
        images: []
    }
    var modalModel = {

    }


    app.load = function (opts) {
        $.ajax({
            method: "GET",
            url: "/images/all",
            processData: true,
            data: opts,
            success: function (data) {
                if (data.length != 0) {
                    queryModel.offset += data.length;
                }
                pageModel.images = pageModel.images.concat(data);
                app.loadImages(pageModel.images, opts.more);
            }
        });
    }

    app.loadImages = function (images, more) {
        imagesList.innerHTML = '<div class="tr"><a href="javascript:app.showModalWin(true);"><img src="/resources/images/add.jpg" /></a></div>';

        var htmlRows = images.map(function (image) {
            return '<div class="tr"><img class="preview-img" src="/images/get/' + image.name + '"></div>';
        })

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
        app.load(queryModel);
        $('#imageSearch').on('input', function (evt) {
            queryModel.filter = evt.target.value;
        })

        $('#searchButton').on('click', function () {
            pageModel.images = [];
            app.load({ filter: queryModel.filter, offset: 0 });
        });

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
            thumbnailHeight: null,
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
                        queryModel.more = false;
                        $('#fileName').val(null);
                        $('#file-thumbnail').attr('src', null);
                        $('#selectTags').val(null).trigger('change')
                       
                        app.load({
                            more: false,
                            offset: 0,
                            pageSize: pageModel.images.length
                        });
                        pageModel.images = [];
                        modalModel = {}
                    }
                });
            });
            reader.readAsArrayBuffer(modalModel.file);
            app.showModalWin(false);
        })

        $(window).scroll(function () {
            console.log(Math.round(($(window).scrollTop() + $(window).height()) / $(document).height()));
            if (Math.round(($(window).scrollTop() + $(window).height()) / $(document).height()) == 1) {
                queryModel.more = true;
                app.load(queryModel);
            }
        });
    });
})()