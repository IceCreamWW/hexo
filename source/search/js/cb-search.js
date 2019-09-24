 $(document).ready(function () {
        var time1 = 0;
        var show = false;
        var names = new Array(); //文章名字等
        var urls = new Array(); //文章地址
        $("#search-modal").on('shown.bs.modal', function(e){
            $("#cb-search-content").val("");
            $("#cb-search-content").focus();
        })
        $(document).keyup(function (e) {
            var time2 = new Date().getTime();
            if (e.keyCode == 17) {
                var gap = time2 - time1;
                time1 = time2;
                if (gap < 500) {
                    $("#search-modal").modal('toggle');
                    time1 = 0;
                }
			}else if(e.keyCode == 27){
                $("#search-modal").modal('hide');
                time1 = 0;
            }
        });

 		$("#cb-search-content").keyup(function (e) {
            var time2 = new Date().getTime();
            if (e.keyCode == 17) {
                var gap = time2 - time1;
                time1 = time2;
                if (gap < 500) {
                    $("#search-modal").modal('toggle');
                    time1 = 0;
                }
            }
        });

        $("#search-btn").click(function(){
            $("#search-modal").modal('show');
            time1 = 0;
        });

        $.getJSON("/search/cb-search.json").done(function (data) {
            if (data.code == 0) {
                for (var index in data.data) {
                    var item = data.data[index];
                    names.push(item.title);
                    urls.push(item.url);
                }

                $("#cb-search-content").typeahead({
                    source: names,
                    fitToElement: true,

                    afterSelect: function (item) {
                        $("#search-modal").modal('hide');
                        window.location.href = (urls[names.indexOf(item)]);
                        return item;
                    }
                });
            }
        }).error(function(data, b) { console.log("json解析错误，搜索功能暂不可用，请检查文章title，确保不含有换行等特殊符号"); });

    });
