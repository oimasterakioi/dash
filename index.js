setTimeout(() => {
    $('.logo').remove();
    $('#app').show();
    $('#task-all').fadeIn(200, () => {
        $('#task-today').fadeIn(200);
    });
}, 5000);

$(".logo").click(function() {
    sweetAlert("Made by OI-Master. Released by AGPLv3 licence.");
});

function cmp(a, b) {
    if (a.done == b.done)
        return 0;
    if (a.done == 1)
        return 1;
    return -1;
}

const fs = require('fs');

var app = new Vue({
    el: '#app',
    data: {
        taskall: [{ str: 'Hello, Dash!', done: false }],
        tasktoday: [{ str: 'Try to add a task', done: false }]
    },
    created: function() {
        try {
            const data = fs.readFileSync('tasklist.json', 'utf8');
            // console.log(data)
            var list = JSON.parse(data);
            this.taskall = list.taskall;
            this.tasktoday = list.tasktoday;
        } catch (err) {
            // that means there is not a tasklist or priv question
            // console.log(err)
        }
    },
    updated: function() {
        try {
            const data = JSON.stringify({ taskall: this.taskall, tasktoday: this.tasktoday });
            fs.writeFileSync('tasklist.json', data)
        } catch (err) {
            // that means priv question
            // console.log(err)
            sweetAlert({
                title: "Error",
                text: "Dash cannot save your changes.\nIf you have any questions, please contact OI-Master.\nDetail: " + err,
                icon: "error"
            });
        }
    },
    methods: {
        delall: function(index) {
            this.taskall.splice(index, 1);
        },
        delnow: function(index) {
            this.tasktoday.splice(index, 1);
        },
        doitnow: function(index) {
            this.tasktoday.push(this.taskall[index]);
            this.taskall.splice(index, 1);
            this.tasktoday.sort(cmp);
        },
        nottoday: function(index) {
            this.taskall.push(this.tasktoday[index]);
            this.tasktoday.splice(index, 1);
            this.taskall.sort(cmp);
        },
        donenow: function(index) {
            this.tasktoday[index].done = true;
            this.tasktoday.sort(cmp);
        },
        doneall: function(index) {
            this.taskall[index].done = true;
            this.taskall.sort(cmp);
        },
        cancelnow: function(index) {
            this.tasktoday[index].done = false;
            this.tasktoday.sort(cmp);
        },
        cancelall: function(index) {
            this.taskall[index].done = false;
            this.taskall.sort(cmp);
        },
        popall: function() {
            $("#plusall").fadeToggle("fast");
        },
        addall: function() {
            var task = $("#plusall").val();
            if (task.trim().length == 0)
                return;
            $("#plusall").val('');
            $("#plusall").fadeOut("fast");
            this.taskall.push({ str: task, done: false });
        },
        poptoday: function() {
            $("#plustoday").fadeToggle("fast");
        },
        addtoday: function() {
            var task = $("#plustoday").val();
            if (task.trim().length == 0)
                return;
            $("#plustoday").val('');
            $("#plustoday").fadeOut("fast");
            this.tasktoday.push({ str: task, done: false });
        }
    }
});