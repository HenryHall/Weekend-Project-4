console.log("We got dem hacks");

$(document).ready(function(){

  initialize();

});//End doc ready

function initialize(){

  $('#createTask').click(function(){
    $(this).hide();
    $('#createTaskDiv').show();
  });

  $('#cancelTask').click(function(){
    $('#taskIn').val('');
    $('#createTaskDiv').hide();
    $('#createTask').show();
  });

  $('#submitTask').click(function(){
    var task = {
      "name": $('#taskIn').val()
    }

    $.ajax({
      type: 'POST',
      url: '/createTask',
      data: task,
      success: function(){
        getTasks();
      }
    });

    $('#taskIn').val('');
    $('#createTaskDiv').hide();
    $('#createTask').show();
  });

  $('#createTaskDiv').hide();
  getTasks();

};

var getTasks = function(){

  $.ajax({
    type: 'GET',
    url: '/retrieveList',
    success: function(data){
      domDisplay(data);
    }
  });

};//End getTasks

var domDisplay = function(toDos){

  $('#actionList').empty();

  for (var i = 0; i<toDos.length; i++){
    $('#actionList').append("<li class='" + toDos[i].complete + "'><div class='infoTask'><p>" + toDos[i].task + "</p><p>" + toDos[i].date + "</p></div><button data-id='" + toDos[i].task + "' class='completeTask' value='" + toDos[i].complete + "'>Complete</button><button data-id='" + toDos[i].task + "' class='deleteTask'>Delete</button>");
  }

  $('.completeTask').click(function(){

    if (this.value == 'true') {
      var taskComplete = false;
    } else {
      var taskComplete = true;
    }

    console.log("In completeTask with: " + $(this).attr('data-id'));

    var task = {
      "name": $(this).attr('data-id'),
      "complete": taskComplete
    }
    console.log("sending: ");
    console.log(task);
    $.ajax({
      type: 'POST',
      url: '/completeTask',
      data: task,
      success: function(){
        getTasks();
      }
    });

  });//End completeTask click

  $('.deleteTask').click(function(){

    console.log("In deleteTask with: " + $(this).attr('data-id'));

    var task = {
      "name": $(this).attr('data-id')
    }
    console.log("sending: ");
    console.log(task);

    $.ajax({
      type: 'POST',
      url: '/deleteTask',
      data: task,
      success: function(){
        getTasks();
      }
    });

  });//End deleteTask click

};//End domDisplay
