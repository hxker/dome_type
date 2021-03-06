$(function() {

    // 报名前检查
    function go_apply(callback) {
        if ($("#signed-in").val() === "false") {
            alert_r("报名前请先登录", function() {
                window.location.href = '/account/sign_in';
            });
        } else {
            if ($("#mobile").text() === "") {
                alert_r("报名前请先登记你的手机号", function() {
                    window.location.href = '/user/mobile';
                });
            } else {
                callback();
            }
        }
    }

    // 队长邀请队员
    function invite_player(user_id,team_id,callback) {
        BootstrapDialog.confirm("确定邀请该用户？",function(result) {
                if (result === true) {
                    $.ajax({
                        url: '/competitions/leader_invite_player',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            td: team_id,
                            ud: user_id
                        },
                        success: function(data) {
                          alert_r(data[1]);
                            if (data[0]) {
                                callback();
                            }
                        }
                    });
                }
        });
    }

    // 队长拒绝他人加入的申请
    function reject(tud,callback) {
        BootstrapDialog.confirm("拒绝此人的加入队伍？",function(result) {
                if (result === true) {
                    $.ajax({
                        url: '/competitions/leader_deal_player_apply',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            tud: tud,
                            reject: '1'
                        },
                        success: function(data) {
                          alert_r(data[1]);
                            if (data[0]) {
                                callback();
                            }
                        }
                    });
                }
        });
    }

    // 队长批准他人加入的申请
    function approve(tud,callback) {
        BootstrapDialog.confirm("同意此人的加入队伍？",function(result) {
                if (result === true) {
                    $.ajax({
                        url: '/competitions/leader_deal_player_apply',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            tud: tud
                        },
                        success: function(data) {
                          alert_r(data[1]);
                            if (data[0]) {
                                callback();
                            }
                        }
                    });
                }
        });
    }

    // 队长解散队伍
    function leader_delete_team(team_id,msg) {
        msg = msg || "确定解散队伍?";
        BootstrapDialog.confirm(msg,function(result) {
                if (result === true) {
                    $.ajax({
                        url: '/competitions/leader_delete_team',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            td: team_id
                        },
                        success: function(data) {
                            if (data[0]) {
                                alert_r(data[1]);
                                window.location.reload();
                            } else {
                                alert_r(data[1]);
                            }
                        }
                    });
                }
        });
    }

    // 队长清退队员
    function leader_delete_player(ud,tr) {
        var team_id = modal_team_id();
        BootstrapDialog.confirm("确定清退该队员?",function(result) {
                if (result === true) {
                    $.ajax({
                        url: '/competitions/leader_delete_player',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            td: team_id,
                            ud: ud
                        },
                        success: function(data) {
                            if (data[0]) {
                                alert_r(data[1]);
                                tr.remove();
                            } else {
                                alert_r(data[1]);
                            }
                        }
                    });
                }
        });
    }

    //队长提交报名
    function leader_submit_team(td) {
        BootstrapDialog.confirm("确定提交比赛信息?",function(result) {
                if (result === true) {
                    $.ajax({
                        url: '/competitions/leader_submit_team',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            td: td
                        },
                        success: function(data) {
                            if (data[0]) {
                                alert_r(data[1], function() {
                                    window.location.reload();
                                });
                            } else {
                                alert_r(data[1]);
                            }
                        }
                    });
                }
            });
    }

    function modal_team_id(){
      return $("#viewTeamModal").data("team_id");
    }

    $(document).on('hidden.bs.modal','.modal', function (e) {
        if($('.modal').hasClass('in')) {
        $('body').addClass('modal-open');
        }
    });

    function accept_invitation(team_id,event_id){
      BootstrapDialog.confirm("确定接受邀请?",function(result) {
              if (result === true) {
                go_apply(function() {

                  $('.modal').modal('hide');
                  $('#user-apply-info').data("apply", {
                      "team_id": team_id,
                      type: "accept_invitation"
                  }).modal();
                });
              }
          });
    }

    function player_status(status,is_leader){
      switch (status) {
        case 0:
        //申请加入
        if(is_leader){
          return "<a class='btn btn-xs btn-info approve'>同意加入</a>";
        }else{
          return "申请加入";
        }
        break;
        case 1:
        //已加入
          return "已加入";
        case 2:
        //已被邀请
          if(is_leader){
            return "已被邀请";
          }else{
            return "<a class='btn btn-xs btn-info accept'>接受邀请</a>";
          }
          break;
        default:
          return "未知";
      }
    }

    // 提交创建队伍表单
    $('#competition-apply-batch-submit').click(function() {
        var fields = [
            {
                "field": "username",
                "msg": "请填写姓名(2-10位的中文或英文字符)！",
                "validate": {
                    "rule": /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/,
                    "msg": "请填写姓名(2-10位的中文或英文字符)！"
                }
            },
            {
                "field": "gender",
                "msg": "请选择性别！"
            },
            {
                "field": "school_id",
                "msg": "请选择学籍所在学校！"
            },
            {
                "field": "sk_station",
                "msg": "请选择报名学校！"
            },
            {
                "field": "grade",
                "msg": "请选择年级！"
            },
            {
                "field": "bj",
                "msg": "请选择年级！！"
            },
            {
                "field": "birthday",
                "msg": "请填写生日！"
            },
            {
                "field": "student_code",
                "msg": "请填写学籍号！"
            },
            {
                "field": "identity_card",
                "msg": "请填写身份证号！",
                "validate": {
                    "rule": checkIdcard,
                    "msg": "请填写正确的身份证号！"
                }
            },
            {
                "field": "group",
                "msg": "请选择组别！"
            },
            {
                "field": "teacher",
                "msg": "请填写指导老师！",
                "validate": {
                    "rule": /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/,
                    "msg": "请填写指导老师(2-10位的中文或英文字符)！"
                }
            }
        ];

        function validate(rule, value) {
            if (rule instanceof RegExp) {
                if (rule.test(value)) {
                    return true;
                } else {
                    return false;
                }
            } else if (typeof rule === "function") {
                if (rule(value)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        var form_error = [];
        var form_data = {};
        var form = $("#competition-apply-batch");
        $.each(fields, function(_index, field) {
            var field_name = field.field;
            var field_tag = form.find("[name='" + field_name + "']");
            var field_val = $.trim(field_tag.val());
            if (field_tag.attr("type") === "radio") {
                field_tag.each(function() {
                    var _this = $(this);
                    if (_this.prop("checked")) {
                        field_val = $.trim(_this.val());
                    }
                });
            }
            if (field_val.length) {
                if (field.validate) {
                    if (validate(field.validate.rule, field_val)) {
                        form_data[field_name] = field_val;
                    } else {
                        form_error.push(field);
                    }
                } else {
                    form_data[field_name] = field_val;
                }
            } else {
                if (field_tag.is(":visible")) {
                    form_error.push(field);
                } else {
                    if (field_tag.attr("type") === "hidden") {
                        form_error.push(field);
                    }
                }
            }
        });

        if (form_error.length) {
            var msg = "";
            $.each(form_error, function(_index, error) {
                msg = msg + "<br>" + error.msg;
            });
            alert_r(msg);
        } else {
            form_data.district_id = $("#district-id").val();
            var apply = $('#user-apply-info').data("apply");
            console.log(apply);
            if (apply.type === "join-team") {//加入队伍
                form_data.td = apply.team_id;
                $.ajax({
                    url: '/competitions/apply_join_team',
                    type: 'post',
                    data: form_data,
                    success: function(data) {
                        alert_r(data.message);
                    }
                });
            } else if (apply.type === "one-event" || apply.type === "multi-event"){//报名项目
                form_data.eds = apply.eds;
                $.ajax({
                    url: '/competitions/leader_batch_apply',
                    type: 'post',
                    data: form_data,
                    success: function(data) {
                        if (data.status === true) {
                            $('#user-apply-info').modal("hide");
                            if (apply.type === "one-event") {
                                alert_r(data.message);
                            }
                        } else {
                            alert_r(data.message);
                        }
                        if ($.isArray(data.success_teams)) {
                            $("#applied-events-wrapper").removeClass("hidden");
                            $("#empty").addClass("hidden");
                            $.each(data.success_teams, function(_index, st) {
                                if (apply.type === "one-event") {//单人项目
                                    $("#applied-events-wrapper tbody").append("<tr data-identifier='" + st.identifier + "' data-team-id='"+ st.team_id +"'><td>" + st.event_name + "</td><td>单人</td><td><a class='btn btn-lightblue submit'>提交</a></td><td><a class='btn btn-lightblue view-info'>查看信息</a></td></tr>");
                                    $("#one-event-" + st.event_id).remove();
                                } else if(apply.type === "multi-event"){//多人项目
                                    $("#multiple_events").find("option[value='" + st.event_id + "']").remove();
                                    $("#applied-events-wrapper tbody").append("<tr data-identifier='" + st.identifier + "' data-team-id='"+ st.team_id +"' ><td>" + st.event_name + "</td><td>多人</td><td><a class='btn btn-lightblue submit'>提交</a></td><td><a class='btn btn-lightblue view-team'>查看队伍</a></td></tr>");
                                    alert_r("你参加" + st.event_name + "的队伍已建立，快把队伍编号：" + st.identifier + "告诉你的小伙伴，让他们加入吧～");
                                }
                            });
                        }
                    }
                });
            }else{
              form_data.td = apply.team_id;
              $.ajax({
                  url: '/competitions/player_agree_leader_invite',
                  type: 'post',
                  data: form_data,
                  success: function(data) {
                      console.log(data);
                      if (data[0] === true) {
                          $('#user-apply-info').modal('hide');
                      }
                      alert_r(data[1]);
                  }
              });
            }

        }
    });

    // 新手引导
    $("#comp-list").guide({
      before_check: function(){
        Date.prototype.sameDay = function(d) {
            return this.getFullYear() === d.getFullYear() && this.getDate() === d.getDate() && this.getMonth() === d.getMonth();
        };
        var comp_tips_open = window.localStorage.getItem("comp_tips_open");
        return (!comp_tips_open || !new Date().sameDay(new Date(comp_tips_open)));
      },
      close_callback:function(){
        window.localStorage.setItem("comp_tips_open", new Date());
      },
      tips:[{
              msg: "报名前请先阅读报名流程后，再根据流程进行操作",
              highlight: "#apply-flow-btn"
          },
          {
              msg: "选择比赛和项目进行报名,完善/更新选手信息",
              highlight: ".middle"
          },
          {
              msg: "多人项目需要等待所有队员加入后提交，单人项目选择项目即可提交。"
          }
      ]
    });

    // 多人项目最终报名提交
    $("#applied-events-wrapper").on("click", ".submit", function() {
        var team_id = $(this).parents("tr").data('team-id');
        leader_submit_team(team_id);
    });
    //查看队伍
    $("#applied-events-wrapper").on("click", ".view-team", function() {
        var tr = $(this).parents("tr");
        var identifier = tr.data('identifier');
        var leader_id = tr.data('leader-id');
        console.log("leader_id:"+leader_id);
        var player_id = tr.data('player-id');
        var is_leader = false;
        if (leader_id === player_id){
          is_leader = true;
        }
        $.ajax({
            url: "/api/v1/events/get_team_by_identifier",
            data: {
                identifier: identifier
            },
            success: function(data) {
                if(data.status === true){
                var school_name = data.school_name;
                var modal = $("#viewTeamModal");
                modal.data("team_id",data.team_id);
                modal.find('.info').html(
                    "<div>项目：" + data.event_name + "</div>" +
                    "<div>编号：" + data.identifier + "</div>" +
                    "<div>人数：" + data.players.length + "</div>" +
                    "<div>组别：" + (data.group === 1 ? "小学" : "中学") + "</div>"
                );
                var tbody = modal.find("#players-table tbody");
                tbody.empty();
                $.each(data.players, function(_index, player) {
                    console.log(player);
                    var tr = $("<tr><td>" + player.username + "</td><td>" + getGender(player.gender) + "</td><td>" + school_name + "</td><td>" + getGrade(player.grade) + "</td><td>"+player.bj+"</td><td>" + player_status(player.status,is_leader) + "</td><td><a class='btn btn-xs btn-danger del leader-required'>删除</a></td></tr>");
                    tr.data("user",player.user_id);
                    tr.data("team-user",player.id);
                    if(!leader_id || player.user_id === leader_id){
                      tr.find('.del').removeClass("leader-required").addClass('hidden');
                    }
                    if(player.status === 0){
                      tr.find('.del').removeClass('del').addClass('reject');
                    }
                    tbody.append(tr);
                });
                $(".multi_only").removeClass("hidden");
                if(!is_leader){
                  $(".leader-required").addClass("hidden");
                }else{
                  $(".leader-required").removeClass("hidden");
                }
                $("#delete-team").text("解散队伍").removeClass('single');
                $("#viewTeamModal").modal();
              }else{
                alert_r(data.message);
              }
            }
        });
    });

    //查看信息（单人）
    $("#applied-events-wrapper").on("click", ".view-info", function() {
        var tr = $(this).parents("tr");
        var identifier = tr.data('identifier');
        $.ajax({
            url: "/api/v1/events/get_team_by_identifier",
            data: {
                identifier: identifier
            },
            success: function(data) {
                if(data.status === true){
                var modal = $("#viewTeamModal");
                modal.data("team_id",data.team_id);
                modal.find('.info').html(
                    "<div>项目：" + data.event_name + "</div>" +
                    "<div>编号：" + data.identifier + "</div>" +
                    "<div>姓名：" + data.players[0].username + "</div>" +
                    "<div>性别：" + getGender(data.players[0].gender) + "</div>" +
                    "<div>学校：" + data.school_name + "</div>" +
                    "<div>年级：" + getGrade(data.players[0].grade) + "</div>" +
                    "<div>班级：" + data.players[0].bj + "</div>" +
                    "<div>组别：" + (data.group === 1 ? "小学" : "中学") + "</div>" +
                    "<div>指导老师：" + data.teacher + "</div>"
                );
                $(".multi_only").addClass("hidden");
                $("#delete-team").text("取消报名").addClass('single');
                $("#viewTeamModal").modal();
              }else{
                alert_r(data.message);
              }
            }
        });
    });
    // 搜索队伍
    $("#search-team-btn").click(function() {
        var identifier = $("#search-team-input").val();
        if ($.trim(identifier).length) {
            $.ajax({
                url: "/api/v1/events/get_team_by_identifier",
                data: {
                    identifier: $.trim(identifier)
                },
                success: function(data) {
                  if(data.status === true){
                    $("#teams-table-wrapper").removeClass("hidden");
                    var tbody = $("#teams-table tbody");
                    var leader_id = data.leader_id;
                    var leader_name = "";
                    $.each(data.players, function(_index, player) {
                        if (player.user_id === leader_id) {
                            leader_name = player.username;
                        }
                    });
                    var tr = $("<tr><td>" + data.event_name + "</td><td>" + data.group + "</td><td>" + leader_name + "</td><td>" + data.school_name + "</td><td><a class='btn btn-lightblue'>加入</a></td></tr>");
                    tbody.html(tr);
                    tr.find(".btn").click(function() {
                        go_apply(function() {
                            $('#user-apply-info').data("apply", {
                                "team_id": data.team_id,
                                type: "join-team"
                            }).modal();
                        });
                    });
                  }else{
                    alert_r(data.message);
                  }
                }
            });
        } else {
            alert_r("请输入队伍编号");
        }
    });

    $("#user-apply-info").on('show.bs.modal', function() {
        var apply_data = $(this).data("apply");
        if (apply_data.type === "join-team" || apply_data.type === "accept_invitation") { //普通队员加入队伍时隐藏‘组别’和‘指导老师’
            $("#group-join").addClass('hidden');
            $("#teacher-join").addClass('hidden');
        }
    });
    $("#user-apply-info").on('hide.bs.modal', function() {
        $("#group-join").removeClass('hidden');
        $("#teacher-join").removeClass('hidden');
    });
    // 单人项目报名
    $('#one-event-apply').on('click', function() {
        go_apply(function() {
            if ($("input[name='one-event']:checked").length) {
                var eds = [];
                $("input[name='one-event']:checked").each(function() {
                    eds.push($(this).val());
                });
                $('#user-apply-info').data("apply", {
                    "eds": eds,
                    type: "one-event"
                }).modal();
            } else {
                alert_r('请至少选择一个比赛项目！');
            }
        });
    });
    // 多人项目报名
    $('#multi-event-apply').on('click', function() {
        go_apply(function() {
            var multi_event = $("#multiple_events").val();
            if ($.trim(multi_event).length) {
                $('#user-apply-info').data("apply", {
                    "eds": [multi_event],
                    type: "multi-event"
                }).modal();
            } else {
                alert_r('请选择一个多人比赛项目！');
            }
        });
    });

    $("#delete-team").on('click',function(){
      if($(this).hasClass("single")){
        leader_delete_team(modal_team_id(),"确定取消报名？");
      }else{
        leader_delete_team(modal_team_id());
      }
    });

    $("#submit-team").on('click',function(){
      leader_submit_team(modal_team_id());
    });

    $("#search-player-result").on('click','.invite',function(){
      var user_id = $(this).data('user');
      var tr = $(this).parents('tr');
      var team_id = modal_team_id();
      invite_player(user_id,team_id,function(){
        $('#search-player-result').addClass('hidden');
        var players_table = $('#players-table').find('tbody');
        tr.find("td:last-child").html("<td>已被邀请</td>");
        players_table.append(tr);
      });
    });

    $("#players-table").on('click','.del',function(){
      var tr =$(this).parents('tr');
      var user_id = tr.data('user');
      leader_delete_player(user_id,tr);
    });

    $("#players-table").on('click','.reject',function(){
      var tr = $(this).parents('tr');
      var tud = tr.data('team-user');
      reject(tud,function(){
        tr.remove();
      });
    });

    $("#players-table").on('click','.approve',function(){
      var tr = $(this).parents('tr');
      var tud = tr.data('team-user');
      approve(tud,function(){
        tr.find("td:last-child .reject").removeClass('reject').addClass('del');
        tr.find("td:nth-last-child(2)").html("已加入");
      });
    });

    $("#players-table").on('click','.accept',function(){
      var team_id = modal_team_id();
      accept_invitation(team_id);
    });

    // 搜索队员
    $('#search-player-btn').on('click', function() {
        var invited_name = $('#search-player-input').val();
        if (invited_name) {
            $.ajax({
                url: '/competitions/search_user',
                dataType: 'json',
                type: 'get',
                data: {
                    invited_name: invited_name
                },
                success: function(data) {
                    if (data[0]) {
                        if (data[1].length === 0) {
                            alert_r('未查询到相关用户');
                        } else {
                            var result = data[1];
                            var player_result = $('#search-player-result');
                            player_result.removeClass('hidden');
                            var tbody = player_result.find('tbody');
                            tbody.empty();
                            $('.search-player-input').val('');
                            $.each(result, function(k, v) {
                                var tr = $('<tr><td>' + v.username + '</td>' +
                                    '<td>' + getGender(v.gender) + '</td>' +
                                    '<td>' + v.school_name + '</td>' +
                                    '<td>' + getGrade(v.grade) + '</td>' +
                                    '<td>' + v.bj + '</td>' +
                                    '<td><button class="btn btn-xs btn-info invite" data-user="' + v.user_id + '">邀请</button></td>' +
                                    '</tr>');
                                tbody.append(tr);
                            });
                        }
                    } else {
                        alert_r(data[1]);
                    }
                },
                error: function(data) {
                    alert_r(data.status);
                }
            });
        } else {
            alert_r('请输入名字的前两个字');
        }
    });

    $('#grade-join').on('change', function(event) {
        event.preventDefault();
        var v = $(this).val();
        if (v >= 10) {
            $('.identity-group-join').removeClass('hide');
        }else{
          $('.identity-group-join').addClass('hide');
        }

    });

    $('#team-group').on('change', function() {
        var _self = $(this);
        var group = _self.val();
        var g = $('#grade-join');
        var icd = $('.identity-group');
        g.find('option').show();
        var a = [];
        switch (group) {
            case '0':
                //未选择
                g.prop('disabled', true);
                icd.addClass('hide');
                break;
            case '1':
                //小学组
                g.prop('disabled', false);
                a = [6, 7, 8, 9, 10, 11, 12];
                icd.addClass('hide');
                break;
            case '2':
                //中学组
                g.prop('disabled', false);
                a = [1, 2, 3, 4, 5];
                icd.addClass('hide');
                break;
            case '3':
                //初中组
                g.prop('disabled', false);
                a = [1, 2, 3, 4, 5, 10, 11, 12];
                icd.addClass('hide');
                break;
            case '4':
                //高中组
                g.prop('disabled', false);
                a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                icd.removeClass('hide');
                break;
        }

        if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
                $(g.find('option').get(a[i])).hide();
            }
            if ($.inArray(parseInt(g.val()), a) > -1) {
                g.val(0);
            }
        }
    });
});
